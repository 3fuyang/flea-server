// DealingReports页面的接口
import * as express from 'express'
import { AppDataSource } from '../../data-source'
import { Orderdata } from './../../entity/OrderData'
import { Reportdata } from './../../entity/ReportData'
import { Useraccount } from './../../entity/UserAccount'
import { Adminaccount } from './../../entity/AdminAccount'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 获取管理员昵称
app.get('/getAdminName/:admin_id', async (req, res) => {
	const result = AppDataSource
		.getRepository(Adminaccount)
		.createQueryBuilder('admin')
		.select('admin.nickname')
		.where('admin.userId = :id', { id: req.params.admin_id })
		.getOne()

	res.end(JSON.stringify(result))
})

// 获取未处理的举报列表
app.post('/getReports', (req, res) => {
	// left join
	/* let data: any
	const promises: any[] = []
	new Promise((resolve, reject) => {
		connection.query(
			'select order_id,reason,report_time,stat from reportData where stat=\'待处理\' order by report_time desc',
			(err, result) => {
				if (err)
					throw err
				data = JSON.parse(JSON.stringify(result))
				resolve('')
			},
		)
	})
		.then(() => {
			for (const item of data) {
				promises.push(
					new Promise((resolve) => {
						connection.query(
							`select buyer,seller,good_id from orderData where order_id = ?;
               select title from goodInfo where good_id=(select good_id from orderData where order_id=?)`,
							[item.order_id, item.order_id],
							(err, result) => {
								if (err)
									throw err
								const raw = JSON.parse(JSON.stringify(result)).flat(2)
								const anotherHalf = Object.assign(raw[0], raw[1])
								for (const property in anotherHalf)
									item[property] = anotherHalf[property]

								resolve('')
							},
						)
					}),
				)
			}
			Promise.all(promises).then(() => {
				res.end(JSON.stringify(data))
			})
		}) */
})

// 封禁被举报用户
app.post('/banAccusedAccount', async (req, res) => {
	await AppDataSource
		.createQueryBuilder()
		.update(Useraccount)
		.set({ available: 1 })
		.where('user_id = :id', { id: req.body.userID })
		.execute()

	const result = await AppDataSource
		.createQueryBuilder()
		.update(Reportdata)
		.set({
			reply: req.body.reply,
			replyTime: req.body.replyTime,
			replyer: req.body.replyer,
		})
		.where('order_id = :id', { id: req.body.orderID })
		.execute()

	res.end(JSON.stringify(result))
})

// 修改被举报订单的举报状态
app.post('/modifyOrderReported', async (req, res) => {
	const result = await AppDataSource
		.createQueryBuilder()
		.update(Orderdata)
		.set({
			reported: req.body.reported,
		})
		.where('order_id = :id', { id: req.body.orderID })
		.execute()

	res.end(JSON.stringify(result))
})

// 驳回举报
app.post('/refuseReport', async (req, res) => {
	const result = await AppDataSource
		.createQueryBuilder()
		.update(Reportdata)
		.set({
			reply: req.body.reply,
			replyTime: req.body.replyTime,
			replyer: req.body.replyer,
			stat: '已驳回',
		})
		.where('order_id = :id', { id: req.body.orderID })
		.execute()

	res.end(JSON.stringify(result))
})

export default app
