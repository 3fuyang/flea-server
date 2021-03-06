import { ReportData } from './../../entity/ReportData'
import { GoodInfo } from './../../entity/GoodInfo'
import { OrderData } from './../../entity/OrderData'
import { UserAccount } from './../../entity/UserAccount'
// Order 页面
import * as express from 'express'
import { AppDataSource } from '../../data-source'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 获取用户购买商品的订单
app.get('/getOrders/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(OrderData)
    .createQueryBuilder('order')
    .leftJoinAndSelect(GoodInfo, 'good', 'order.goodId = good.goodId')
    .select([
      'order',
      'good.title',
      'good.price',
      'good.images',
      'good.sellerId'
    ])
    .where('order.buyer = :bid', { bid: req.params.user_id })
    .orderBy('order.generatedTime', 'DESC')
    .getRawMany()

  res.send(JSON.stringify(result))
})

// 获取卖家昵称，头像url
app.get('/sellerAvatarAndName/:seller_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(UserAccount)
    .createQueryBuilder('user')
    .select([
      'user.nickname',
      'user.avatar'
    ])
    .where('user.userId = :uid', { uid: req.params.seller_id })
    .getOne()

  res.send(JSON.stringify(result))
})

// 确认完成订单
app.post('/completeOrder', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .update(OrderData)
    .set({
      stat: '待评价'
    })
    .where('order_id = :oid', { oid: req.body.orderID })
    .execute()

  res.send(JSON.stringify(result))
})

// 获取订单评价
app.get('/getOrderEvaluation/:order_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(OrderData)
    .createQueryBuilder('order')
    .select([
      'order.review',
      'order.rate'
    ])
    .where('order.orderId = :oid', { oid: req.params.order_id })
    .getMany()

  res.send(JSON.stringify(result))
})

// 提交评价
app.post('/submitEvaluation', async (req, res) => {
  const result = await AppDataSource
    .getRepository(OrderData)
    .createQueryBuilder()
    .update()
    .set({
      review: req.body.review,
      rate: req.body.rate,
      reviewTime: req.body.time,
      stat: '已完成'
    })
    .where('order_id = :oid', { oid: req.body.orderID })
    .execute()

  res.send(JSON.stringify(result))
})

// 查询举报
app.get('/getReport/:order_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(ReportData)
    .createQueryBuilder('report')
    .select([
      'report.reason',
      'report.stat',
      'report.reply',
      'report.replyTime',
      'report.replyer'
    ])
    .where('report.orderId = :oid', { oid: req.params.order_id })
    .getMany()

  res.send(JSON.stringify(result))
})

// 举报订单
app.post('/reportOrder', async (req, res) => {
  await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(ReportData)
    .values({
      orderId: req.body.orderID,
      reason: req.body.reason,
      reportTime: req.body.time
    })
    .execute()

  const result = await AppDataSource
    .getRepository(OrderData)
    .createQueryBuilder('order')
    .update()
    .set({
      reported: '待处理'
    })
    .where('order_id = :oid', { oid: req.body.orderID })
    .execute()

  res.send(JSON.stringify(result))
})

// 订单付款
app.post('/payOrder', async (req, res) => {
  const result = await AppDataSource
    .getRepository(OrderData)
    .createQueryBuilder('order')
    .update()
    .set({
      stat: '待确认'
    })
    .where('order.orderId = :oid', { oid: req.body.orderID })
    .execute()

  res.send(JSON.stringify(result))
})

export default app