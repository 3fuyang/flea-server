/* Chat 页面 */
import * as express from 'express'
import { EventEmitter } from 'events'
import { AppDataSource } from '../../data-source'
import { Chatrecord } from './../../entity/ChatRecord'
import { Useraccount } from './../../entity/UserAccount'

const eventEmitter = new EventEmitter()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 根据ID, 获取单个用户的昵称、头像
app.get('/getOponentInfo/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder('user')
    .select([ 'user.userId', 'user.nickname', 'user.avatar' ])
    .where('user.userId = :id', { id: req.params.user_id })
    .getOne()

  res.send(JSON.stringify(result))
})

interface OponentLog {
  aUserId?: string
  bUserId?: string
  dateTime: string
}

// 接口18 获取与用户有消息的对象列表：传入（用户ID）  返回（对方用户列表：对方ID，昵称，头像，最新消息）
app.get('/getChatOponent/:user_id', async (req, res) => {
  // 两种情况，aUserId 或 bUserId
  const oponentA = await AppDataSource
    .getRepository(Chatrecord)
    .createQueryBuilder('chat')
    .select([
      'chat.aUserId',
      'chat.dateTime'
    ])
    .where('chat.bUserId = :uid', { uid: req.params.user_id })
    .orderBy('chat.dateTime', 'DESC')
    .getMany()

  const oponentB = await AppDataSource
    .getRepository(Chatrecord)
    .createQueryBuilder('chat')
    .select([
      'chat.bUserId',
      'chat.dateTime'
    ])
    .where('chat.aUserId = :uid', { uid: req.params.user_id })
    .orderBy('chat.dateTime', 'DESC')
    .getMany()

  // 合并两次查询结果
  const rawOponents: OponentLog[] = JSON.parse(JSON.stringify(oponentA)).concat(JSON.parse(JSON.stringify(oponentB)))
    .sort((first: OponentLog, second: OponentLog) =>
      Date.parse(second.dateTime.substring(0, 19)) - Date.parse(first.dateTime.substring(0, 19))
    )

  // 去重
  const oponents = Array.from(new Set(rawOponents.map(oponent => oponent.aUserId || oponent.bUserId)))

  const promises = []
  const results = []
  oponents.forEach((oponent) => {
    promises.push(AppDataSource
      .getRepository(Useraccount)
      .createQueryBuilder('user')
      .select([
        'user.nickname',
        'user.avatar'
      ])
      .where('user.userId = :uid', { uid: oponent })
      .getOne()
      .then(async (oponentInfo) => {
        const message = await AppDataSource
          .getRepository(Chatrecord)
          .createQueryBuilder('chat')
          .select([
            'chat.details',
            'chat.dateTime'
          ])
          .where('chat.aUserId = :self and chat.bUserId = :oponent')
          .orWhere('chat.aUserId = :oponent and chat.bUserId = :self')
          .setParameters({
            self: req.params.user_id,
            oponent: oponent
          })
          .orderBy('chat.dateTime', 'DESC')
          .limit(1)
          .getOne()

        results.push(Object.assign(message, oponentInfo, { userID: oponent }))
      })
    )
  })

  Promise.all(promises)
    .then(() => {
      res.send(JSON.stringify(results))
    })
})

// 接口19 获取与某个用户的消息列表
app.get('/getMessage/:a_user_id/:b_user_id', async (req, res) => {
  // 较小的账号为 a_user_id , 较大的账号为 b_user_id
  if (req.params.a_user_id > req.params.b_user_id) {
    [ req.params.a_user_id, req.params.b_user_id ] = [ req.params.b_user_id, req.params.a_user_id ]
  }

  const result = await AppDataSource
    .getRepository(Chatrecord)
    .createQueryBuilder('chat')
    .where('chat.aUserId = :aid and chat.bUserId = :bid', { aid: req.params.a_user_id, bid: req.params.b_user_id })
    .orderBy('chat.dateTime', 'ASC')
    .getMany()

  res.send(JSON.stringify(result))
})

// 接口20 向某个用户发送消息
app.post('/sendMessage', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(Chatrecord)
    .values({
      aUserId: req.body.a_user_id,
      bUserId: req.body.b_user_id,
      speaker: req.body.speaker,
      dateTime: req.body.date_time,
      details: req.body.details
    })
    .execute()

  res.send(JSON.stringify(result))
})

export default app