import { Chatrecord } from './../../entity/ChatRecord'
import { Useraccount } from './../../entity/UserAccount'
/* Chat 页面 */
import * as express from 'express'
import { EventEmitter } from 'events'
import { AppDataSource } from '../../data-source'

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

  res.end(JSON.stringify(result))
})

// 接口18 获取与用户有消息的对象列表：传入（用户ID）  返回（对方用户列表：对方ID，昵称，头像，最新消息）
app.get('/getChatOponent/:user_id', async (req, res) => {
  // 两种情况，aUserId 或 bUserId
  let finalResult: any
  eventEmitter.on('done', () => {
    const promises: any[] = []
    finalResult.forEach((id: string) => {
      promises.push(
        new Promise((resolve) => {
          connection.query(
            `select nickname,avatar from userAccount where user_id = ?;
              select details, date_time from chatRecord where (a_user_id = ? and b_user_id = ?) or (a_user_id = ? and b_user_id = ?) order by date_time desc limit 0,1`,
            [ id, id, req.params.user_id, req.params.user_id, id ],
            (err, result) => {
              if (err) throw err
              const raw = JSON.parse(JSON.stringify(result)).flat(2)
              const anotherHalf = Object.assign(raw[0], raw[1])              
              resolve({
                user_id: id,
                nickname: anotherHalf['nickname'],
                avatar: anotherHalf['avatar'],
                latest: anotherHalf['details']
              })
            }
          )
        })
      )
    })
    Promise.all(promises)
      .then(result => res.end(JSON.stringify(result)))
  })  
  new Promise((resolve, reject) => {
    connection.query(
      'select a_user_id,date_time from chatRecord where b_user_id = ? order by date_time desc',
      [ req.params.user_id ],
      (err, result) => {
        if (err) throw err
        result = JSON.parse(JSON.stringify(result))
        resolve(result)  
      }
    )
  })
    .then((halfResult) => {
      connection.query(
        'select b_user_id,date_time from chatRecord where a_user_id =?',
        [ req.params.user_id ],
        (err, result) => {
          if (err) throw err
          result = (halfResult as any[])
            .concat(JSON.parse(JSON.stringify(result)))
            .sort((first, second) => 
              Date.parse(second.date_time.substr(0, 19)) - Date.parse(first.date_time.substr(0, 19))
            )
          finalResult = Array.from(new Set(result.map((item: any) => item.a_user_id || item.b_user_id)))
          eventEmitter.emit('done')
        }
      )
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

  res.end(JSON.stringify(result))
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

  res.end(JSON.stringify(result))
})

export default app