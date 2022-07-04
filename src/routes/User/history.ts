/* History 页面 */
import * as express from 'express'
import { AppDataSource } from '../../data-source'
import { BrowseTrack } from './../../entity/BrowseTrack'
import { GoodInfo } from './../../entity/GoodInfo'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 添加浏览记录：传入（用户ID，商品ID，时间） 返回（null）
app.post('/addTrack', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(BrowseTrack)
    .values({
      userId: req.body.userID,
      goodId: req.body.goodID,
      dayTime: req.body.time
    })
    .execute()

  res.send(JSON.stringify(result))
})

// 接口11 获取浏览记录：传入（用户ID） 返回（浏览记录数据:商品ID、浏览日期）
app.get('/getTrack/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(BrowseTrack)
    .createQueryBuilder('history')
    .leftJoinAndSelect(GoodInfo, 'good', 'history.goodId = good.goodId')
    .select([
      'history',
      'good.title',
      'good.price',
      'good.images'
    ])
    .where('history.userId = :uid', { uid: req.params.user_id })
    .orderBy('history.dayTime', 'DESC')
    .getRawMany()

  res.send(JSON.stringify(result))
})

// 接口13 清空浏览记录：传入（用户ID） 返回（null）
app.get('/clearTrack/:user_id', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(BrowseTrack)
    .where('user_id = :uid', { uid: req.params.user_id })
    .execute()

  res.send(JSON.stringify(result))
})

export default app