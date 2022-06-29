import { Shoppingcart } from './../../entity/ShoppingCart'
import { Goodinfo } from './../../entity/GoodInfo'
import { Orderdata } from './../../entity/OrderData'
import { Useraccount } from './../../entity/UserAccount'
// Confirm 页面
import * as express from 'express'
import { AppDataSource } from '../../data-source'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 获取买家姓名、手机号
app.get('/getBuyerInfo/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder('user')
    .select([ 'user.realName', 'user.telnum' ])
    .where('user.userId = :id', { id: req.params.user_id })
    .getOne()

  res.end(JSON.stringify(result))
})

// 获取商品信息
app.post('/goodsToConfirm', async (req, res) => {
  const promises = []

  req.body.forEach((gid: string) => {
    promises.push(
      AppDataSource
        .getRepository(Goodinfo)
        .createQueryBuilder('good')
        .leftJoinAndSelect(Useraccount, 'user', 'good.sellerId = user.userId')
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
      res.end(JSON.stringify(result))
    })
})

// 生成订单
app.post('/generateOrder', async (req, res) => {
  const { buyer, seller, goodId, price, generatedTime, stat } = req.body
  // 向orderData插入新订单，在goodInfo中更新商品为不可访问，从买家的shoppingCart中删除商品
  await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(Orderdata)
    .values({
      buyer,
      seller,
      goodId,
      price,
      generatedTime,
      stat
    })
    .execute()

  await AppDataSource
    .getRepository(Goodinfo)
    .createQueryBuilder()
    .update()
    .set({
      available: 1
    })
    .where('good_id = :id', { id: goodId })
    .execute()

  const result = await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(Shoppingcart)
    .where('good_id = :id', { id: goodId })
    .execute()

  res.end(JSON.stringify(result))
})

export default app