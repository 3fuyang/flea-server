// Info页面的接口
import * as express from 'express'
import * as multer from 'multer'
import { renameSync } from 'fs'
import { FileInfo } from './goods'
import { AppDataSource } from '../../data-source'
import { Useraccount } from './../../entity/UserAccount'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 获取用户信息
app.get('/getUserInfo/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder('user')
    .where('user.userId = :uid', { uid: req.params.user_id })
    .getOne()

  res.end(JSON.stringify(result))
})

// 修改用户信息
app.post('/modifyUserInfo', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Useraccount)
    .createQueryBuilder()
    .update()
    .set({
      nickname: req.body.nickname,
      biography: req.body.selfIntro,
      college: req.body.college,
      gender: req.body.gender,
      birthday: req.body.birthday
    })
    .where('user_id = :id', { id: req.body.userID })
    .execute()

  res.end(JSON.stringify(result))
})

// 上传头像
app.post(
  '/uploadAvatar',
  multer({
    // 设置文件存储路径
    dest: './public/avatars'
  }).array('file', 1),  // 注意：这里的字段必须与前端formdata的字段名相同
  async (req: any, res, next) => {
    const fileInfoList = []
    let name = ''
    req.files.forEach((file: any) => {
      const fileInfo = new FileInfo()
      const path = './public/avatars/' + Date.now().toString() + '_' + file.originalname
      renameSync('./public/avatars/' + file.filename, path)
      // 获取文件基本信息
      fileInfo.type = file.mimetype
      fileInfo.name = file.originalname
      name = fileInfo.name
      fileInfo.size = file.size
      fileInfo.path = path
      fileInfoList.push(fileInfo)
    })

    const result = await AppDataSource
      .getRepository(Useraccount)
      .createQueryBuilder()
      .update()
      .set({
        avatar: name
      })
      .where('user_id = :uid', { uid: req.get('userID') })
      .execute()

    res.end(JSON.stringify(result))
  }
)

export default app