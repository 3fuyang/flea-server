import { CollectionBox } from './../entity/CollectionBox'
import { GoodInfo } from './../entity/GoodInfo'
// Home页面的接口
import * as express from 'express'
import { AppDataSource } from '../data-source'
import { UserAccount } from '../entity/UserAccount'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 商品是否可访问
app.get('/checkAvailable/:good_id', async (req, res) => {
  const count = await AppDataSource
    .getRepository(GoodInfo)
    .createQueryBuilder()
    .where('good_id = :id and available = :available', { id: req.params.good_id, available: 0 })
    .getCount()

  const isAvailable = count === 0 ? false : true

  res.send(JSON.stringify(isAvailable))
})

// 接口21 获取商品详情
app.get('/getGoods/:good_id', async (req, res) => {
  const goodInfo = await AppDataSource
    .getRepository(GoodInfo)
    .createQueryBuilder('good')
    .where('good.goodId = :gid', { gid: req.params.good_id })
    .getOne()

  const result = {
    ...goodInfo,
    likes: await AppDataSource
      .getRepository(CollectionBox)
      .createQueryBuilder('collection')
      .where('collection.goodId = :gid', { gid: req.params.good_id })
      .getCount()
  }

  res.send(JSON.stringify(result))
})

// 接口22 获取卖家信息
app.get('/getSellerInfo/:user_id', async (req, res) => {
  const baseInfo = await AppDataSource
    .getRepository(UserAccount)
    .createQueryBuilder('user')
    .select([ 'user.nickname', 'user.avatar' ])
    .where('user.userId = :id', { id: req.params.user_id })
    .getOne()

  const result = {
    ...baseInfo,
    reputation: '良好',
    score: '4.5'
  }

  res.send(JSON.stringify(result))
})

// 获取任意4个商品的简要信息，作为趋势列表
app.get('/getTrends', async (req, res) => {
  const result = await AppDataSource
    .getRepository(GoodInfo)
    .createQueryBuilder('good')
    .select([ 'good.goodId', 'good.price', 'good.title', 'good.images' ])
    .where('available = :available', { available: 0 })
    .orderBy('RAND()')
    .limit(4)
    .getMany()

  res.send(JSON.stringify(result))
})

export default app