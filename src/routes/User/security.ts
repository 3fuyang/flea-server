// Security页面的接口
import * as express from 'express'
import { AppDataSource } from '../../data-source'
import { Useraccount } from './../../entity/UserAccount'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 接口9 获取绑定手机号: 传入（用户id） 返回（绑定手机号）
app.get('/usertel/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder('user')
    .select([
      'user.telnum'
    ])
    .where('user.userId = :uid', { uid: req.params.user_id })
    .getOne()

  res.send(JSON.stringify(result.telnum))
})

// 接口10 修改绑定手机：传入（用户ID，新手机号） 返回（null）
app.post('/modifytel', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder('user')
    .update()
    .set({
      telnum: req.body.newtel
    })
    .where('user.userId = :uid', { uid: req.body.id })
    .execute()

  res.send(JSON.stringify(result))
})

export default app