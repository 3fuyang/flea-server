import { Goodinfo } from './../entity/GoodInfo'
import { Orderdata } from './../entity/OrderData'
import { Shoppingcart } from './../entity/ShoppingCart'
// Home页面的接口
import * as express from 'express'
import { AppDataSource } from '../data-source'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 接口7 主页信息：传入（用户ID）  返回（获取用户购物车中商品数量, 进行中订单数, 未评价订单数）
app.get('/homeinfo/:user_id', async (req, res) => {
  const homeinfo = {
    shoppingCartNum: 0,
    notPaidNum: 0,
    notEvaluateNum: 0
  }

  homeinfo.shoppingCartNum = await AppDataSource
    .getRepository(Shoppingcart)
    .createQueryBuilder('shoppingcart')
    .where('user_id = :id', { id: req.params.user_id })
    .getCount()

  homeinfo.notPaidNum = await AppDataSource
    .getRepository(Orderdata)
    .createQueryBuilder('order')
    .where('buyer = :buyer and stat = :stat', { buyer: req.params.user_id, stat: '进行中' })
    .getCount()

  homeinfo.notEvaluateNum = await AppDataSource
    .getRepository(Orderdata)
    .createQueryBuilder('order')
    .where('buyer = :buyer and stat = :stat', { buyer: req.params.user_id, stat: '未评价' })
    .getCount()

  res.end(JSON.stringify(homeinfo))
})

// 接口8 获取商品信息：传入（商品ID） 返回（商品标题、价格、图片url）
app.get('/goodsbriefinfo/:good_id', async (req, res) => {

  const result = await AppDataSource
    .getRepository(Goodinfo)
    .createQueryBuilder('good')
    .select([ 'good.goodId', 'good.images', 'good.title' ])
    .where('good_id = :gid', { gid: req.params.good_id })
    .getOne()

  res.end(JSON.stringify(result))
})

export default app