import { GoodInfo } from './../../entity/GoodInfo'
// Favorite 页面
import * as express from 'express'
import { AppDataSource } from '../../data-source'
import { CollectionBox } from '../../entity/CollectionBox'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 检查是否收藏商品
app.post('/checkCollected', async (req, res) => {
  const result = await AppDataSource
    .getRepository(CollectionBox)
    .createQueryBuilder('collection')
    .where('collection.userId = :uid and collection.goodId = :gid', { uid: req.body.userID, gid: req.body.goodID })
    .getCount()

  const collected = result > 0 ? true : false

  res.send(JSON.stringify(collected))
})

// 收藏商品
app.post('/collectGood', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(CollectionBox)
    .values({
      userId: req.body.userID,
      goodId: req.body.goodID,
      dayTime: req.body.time
    })
    .execute()

  res.send(JSON.stringify(result))
})

// 接口14 获取收藏夹：传入（用户ID） 返回（收藏夹数据:商品ID）
app.get('/getCollection/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(CollectionBox)
    .createQueryBuilder('collection')
    .leftJoinAndSelect(GoodInfo, 'good', 'collection.goodId = good.goodId')
    .select([
      'collection',
      'good.title',
      'good.price',
      'good.images'
    ])
    .where('collection.userId = :uid', { uid: req.params.user_id })
    .getRawMany()

  res.send(JSON.stringify(result))
})

// 接口15 取消收藏某商品：传入（用户ID，商品ID） 返回（null）
app.post('/cancelCollection', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(CollectionBox)
    .where('user_id = :uid and good_id = :gid', { uid: req.body.userID, gid: req.body.goodID })
    .execute()

  res.send(JSON.stringify(result))
})

export default app