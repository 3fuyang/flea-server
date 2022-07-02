import { Adminaccount } from './../entity/AdminAccount'
import { Useraccount } from './../entity/UserAccount'
// Login页面的接口
import * as express from 'express'
import { AppDataSource } from '../data-source'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 接口1 用户登录：传入（账号、密码） 返回（登录结果）
app.post('/userlogin', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder('user')
    .where('user.userId = :id and user.mypassword = :pwd', { id: req.body.id, pwd: req.body.password })
    .getCount()

  const doesExist = result > 0 ? true : false

  res.send(JSON.stringify(doesExist))
})

// 接口2 管理员登录：传入（账号、密码） 返回（登录结果）
app.post('/adminlogin', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Adminaccount)
    .createQueryBuilder('admin')
    .where('admin.userId = :id and admin.mypassword = :pwd', { id: req.body.id, pwd: req.body.password })
    .getCount()

  const doesExist = result > 0 ? true : false

  res.send(JSON.stringify(doesExist))
})

// 接口3 校验学号或手机号是否已被注册：传入（学号、手机号） 返回（是否已被注册）
app.post('/isrepeated', async (req, res) => {
  const count = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder('user')
    .where('userId = :id or telnum = :tel', { id: req.body.id, tel: req.body.telnum })
    .getCount()

  const isRepeated = count > 0 ? true : false

  res.send(JSON.stringify(isRepeated))
})

// 接口4 用户注册：传入（账号、密码、姓名、手机号、性别、学院、生日） 返回（null）
app.post('/register', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(Useraccount)
    .values([
      {
        userId: req.body.user_id,
        mypassword: req.body.mypassword,
        realName: req.body.myname,
        telnum: req.body.telnum,
        gender: req.body.gender,
        college: req.body.college,
        birthday: req.body.birthday,
        nickname: req.body.myname
      }
    ])
    .execute()

  res.send(JSON.stringify(result))
})

// 接口5 校验学号和手机号是否已被注册且匹配：传入（学号、手机号） 返回（是否已被注册且匹配）
app.post('/idcoupletel', async (req, res) => {
  const count = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder('user')
    .where('userId = :id and telnum = :tel', { id: req.body.id, telnum: req.body.telnum })
    .getCount()

  const isCoupled = count > 0 ? true : false

  res.send(JSON.stringify(isCoupled))
})

// 接口6 用户修改密码：传入（ID、新密码） 返回（null）
app.post('/modifypassword', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .update(Useraccount)
    .set({ mypassword: req.body.newpassword })
    .where('userId = :id', { id: req.body.id })
    .execute()

  res.send(JSON.stringify(result))
})

export default app