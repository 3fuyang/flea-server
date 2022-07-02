/* Trade 页面 */
import * as express from 'express'
import { AppDataSource } from '../../data-source'
import { Useraccount } from './../../entity/UserAccount'
import { Orderdata } from './../../entity/OrderData'
import { Goodinfo } from './../../entity/GoodInfo'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 获取买家昵称，头像
app.get('/getBuyerAvatarAndName/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder('user')
    .select([
      'user.nickname',
      'user.avatar'
    ])
    .where('user.userId = :uid', { uid: req.params.user_id })
    .getOne()

  res.send(JSON.stringify(result))
})

// 获取卖出的订单
app.get('/getSoldOrders/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Orderdata)
    .createQueryBuilder('order')
    .leftJoinAndSelect(Goodinfo, 'good', 'order.goodId = good.goodId')
    .leftJoinAndSelect(Useraccount, 'user', 'order.buyer = user.userId')
    .select([
      'order',
      'good.title',
      'good.images',
      'user.nickName'
    ])
    .where('order.seller = :sid', { sid: req.params.user_id })
    .orderBy('order.generatedTime', 'DESC')
    .getRawMany()

  res.send(JSON.stringify(result))
})

// 拒接订单
app.post('/rejectOrder', async (req, res) => {
  await AppDataSource
    .getRepository(Orderdata)
    .createQueryBuilder('order')
    .update()
    .set({
      stat: '已取消'
    })
    .where('order.orderId = :oid', { oid: req.body.orderID })
    .execute()

  const result = await AppDataSource
    .query('update goodInfo set available=0 where good_id=(select good_id from orderData where order_id = ?', [ req.body.orderID ])

  res.send(JSON.stringify(result))
})

export default app