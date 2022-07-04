// DealingReports页面的接口
import * as express from 'express'
import { AppDataSource } from '../../data-source'
import { OrderData } from './../../entity/OrderData'
import { ReportData } from './../../entity/ReportData'
import { UserAccount } from './../../entity/UserAccount'
import { AdminAccount } from './../../entity/AdminAccount'
import { GoodInfo } from './../../entity/GoodInfo'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 获取管理员昵称
app.get('/getAdminName/:admin_id', async (req, res) => {
  const result = AppDataSource
    .getRepository(AdminAccount)
    .createQueryBuilder('admin')
    .select('admin.nickname')
    .where('admin.userId = :id', { id: req.params.admin_id })
    .getOne()

  res.send(JSON.stringify(result))
})

// 获取未处理的举报列表
app.post('/getReports', async (req, res) => {
  // left join
  const result = await AppDataSource
    .getRepository(ReportData)
    .createQueryBuilder('report')
    .leftJoinAndSelect(OrderData, 'order', 'report.orderId = order.orderId')
    .leftJoinAndSelect(GoodInfo, 'good', 'order.goodId = good.goodId')
    .select([
      'report.orderId',
      'report.reason',
      'report.reportTime',
      'report.stat',
      'order.buyer',
      'order.seller',
      'order.good_id',
      'good.title'
    ])
    .where('report.stat = :stat', { stat: '已驳回' })
    .orderBy('report.reportTime', 'DESC')
    // getMany()只返回report实体的数据，估计是别名映射上的某些问题
    .getRawMany()

  res.send(JSON.stringify(result))
})

// 封禁被举报用户
app.post('/banAccusedAccount', async (req, res) => {
  await AppDataSource
    .createQueryBuilder()
    .update(UserAccount)
    .set({ available: 1 })
    .where('user_id = :id', { id: req.body.userID })
    .execute()

  const result = await AppDataSource
    .createQueryBuilder()
    .update(ReportData)
    .set({
      reply: req.body.reply,
      replyTime: req.body.replyTime,
      replyer: req.body.replyer
    })
    .where('order_id = :id', { id: req.body.orderID })
    .execute()

  res.send(JSON.stringify(result))
})

// 修改被举报订单的举报状态
app.post('/modifyOrderReported', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .update(OrderData)
    .set({
      reported: req.body.reported
    })
    .where('order_id = :id', { id: req.body.orderID })
    .execute()

  res.send(JSON.stringify(result))
})

// 驳回举报
app.post('/refuseReport', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .update(ReportData)
    .set({
      reply: req.body.reply,
      replyTime: req.body.replyTime,
      replyer: req.body.replyer,
      stat: '已驳回'
    })
    .where('order_id = :id', { id: req.body.orderID })
    .execute()

  res.send(JSON.stringify(result))
})

export default app
