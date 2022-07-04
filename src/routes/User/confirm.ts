import { ShoppingCart } from './../../entity/ShoppingCart'
import { GoodInfo } from './../../entity/GoodInfo'
import { OrderData } from './../../entity/OrderData'
import { UserAccount } from './../../entity/UserAccount'
// Confirm 页面
import * as express from 'express'
import { AppDataSource } from '../../data-source'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 获取买家姓名、手机号
app.get('/getBuyerInfo/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(UserAccount)
    .createQueryBuilder('user')
    .select([ 'user.realName', 'user.telnum' ])
    .where('user.userId = :id', { id: req.params.user_id })
    .getOne()

  res.send(JSON.stringify(result))
})

// 获取商品信息
app.post('/goodsToConfirm', async (req, res) => {
  const promises = []

  req.body.forEach((gid: string) => {
    promises.push(
      AppDataSource
        .getRepository(GoodInfo)
        .createQueryBuilder('good')
        .leftJoinAndSelect(UserAccount, 'user', 'good.sellerId = user.userId')
        .select([
          'good.goodId',
          'good.title',
          'good.price',
          'good.images',
          'good.sellerId',
          'user.nickname'
        ])
        .where('good.goodId = :id', { id: gid })
        .getRawOne())
  })

  Promise.all(promises)
    .then(result => {
      res.send(JSON.stringify(result))
    })
})

// 生成订单
app.post('/generateOrder', async (req, res) => {
  // 向orderData插入新订单，在goodInfo中更新商品为不可访问，从买家的shoppingCart中删除商品
  await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(OrderData)
    .values({
      buyer: req.body.buyer,
      seller: req.body.seller,
      goodId: req.body.goodID,
      stat: req.body.stat,
      price: req.body.price,
      generatedTime: req.body.generatedTime,
      reported: '未举报'
    })
    .execute()

  await AppDataSource
    .getRepository(GoodInfo)
    .createQueryBuilder()
    .update()
    .set({
      available: 1
    })
    .where('good_id = :id', { id: req.body.goodID })
    .execute()

  const result = await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(ShoppingCart)
    .where('good_id = :id', { id: req.body.goodID })
    .execute()

  res.send(JSON.stringify(result))
})

export default app