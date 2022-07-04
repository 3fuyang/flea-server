/* Goods 页面 */
import * as express from 'express'
import * as multer from 'multer'
import { renameSync } from 'fs'
import { AppDataSource } from '../../data-source'
import { BrowseTrack } from './../../entity/BrowseTrack'
import { CollectionBox } from './../../entity/CollectionBox'
import { GoodInfo } from './../../entity/GoodInfo'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

type GoodOnShlef = GoodInfo & {
  likes?: number
  browsed?: number
}

// 获取上架中商品
app.get('/onShelfGoods/:user_id', async (req, res) => {
  const promises = []

  const result: GoodOnShlef[] = await AppDataSource
    .getRepository(GoodInfo)
    .createQueryBuilder('good')
    .where('good.sellerId = :sid and good.available = :available', { sid: req.params.user_id, available: 0 })
    .getMany()

  result.forEach(async (info) => {
    promises.push(AppDataSource
      .getRepository(CollectionBox)
      .createQueryBuilder('collection')
      .where('collection.goodId = :gid', { gid: info.goodId })
      .getCount()
      .then((likes) => {
        info.likes = likes
      }))

    promises.push(AppDataSource
      .getRepository(BrowseTrack)
      .createQueryBuilder('history')
      .where('history.goodId = :gid', { gid: info.goodId })
      .getCount()
      .then((browsed) => {
        info.browsed = browsed
      }))
  })

  Promise.all(promises)
    .then(() => {
      res.send(result)
    })
})

// 获取已售出商品
app.get('/soldGoods/:user_id', async (req, res) => {
  const promises = []

  const result: GoodOnShlef[] = await AppDataSource
    .getRepository(GoodInfo)
    .createQueryBuilder('good')
    .where('good.sellerId = :sid and good.available = :available', { sid: req.params.user_id, available: 1 })
    .getMany()

  result.forEach(async (info) => {
    promises.push(AppDataSource
      .getRepository(CollectionBox)
      .createQueryBuilder('collection')
      .where('collection.goodId = :gid', { gid: info.goodId })
      .getCount()
      .then((likes) => {
        info.likes = likes
      }))

    promises.push(AppDataSource
      .getRepository(BrowseTrack)
      .createQueryBuilder('history')
      .where('history.goodId = :gid', { gid: info.goodId })
      .getCount()
      .then((browsed) => {
        info.browsed = browsed
      }))
  })

  Promise.all(promises)
    .then(() => {
      res.send(result)
    })
})

// 文件信息类
class FileInfo {
  type = ''
  name = ''
  size = 0
  path = ''
}

// 上传图片
app.post(
  '/uploadImage',
  multer({
    // 设置文件存储路径
    dest: './public/images'
  }).array('file', 3),  // 注意：这里的字段必须与前端formdata的字段名相同
  (req: any, res, next) => {
    const fileInfoList: any[] = []
    req.files.forEach((file: any) => {
      const fileInfo = new FileInfo()
      const path = './public/images/' + Date.now().toString() + '_' + file.originalname
      renameSync('./public/images/' + file.filename, path)
      // 获取文件基本信息
      fileInfo.type = file.mimetype
      fileInfo.name = path.split('/')[3]
      fileInfo.size = file.size
      fileInfo.path = path
      fileInfoList.push(fileInfo)
    })
    res.send(JSON.stringify(fileInfoList))
  }
)

// 上架新商品
app.post('/addGood', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(GoodInfo)
    .values({
      sellerId: req.body.seller_id,
      price: req.body.price,
      category: req.body.category,
      name: req.body.good_name,
      title: req.body.title,
      keywords: req.body.keywords,
      campus: req.body.campus,
      intro: req.body.intro,
      images: req.body.images,
      onshelfTime: req.body.onshelf_time
    })
    .execute()

  res.send(JSON.stringify(result))
})

// 修改上架中商品信息
app.post('/modifyGood', async (req, res) => {
  const result = await AppDataSource
    .getRepository(GoodInfo)
    .createQueryBuilder()
    .update()
    .set({
      price: req.body.price,
      category: req.body.category,
      name: req.body.good_name,
      title: req.body.title,
      keywords: req.body.keywords,
      campus: req.body.campus,
      intro: req.body.intro,
      images: req.body.images
    })
    .where('good_id = :gid', { gid: req.body.goodID })
    .execute()

  res.send(JSON.stringify(result))
})

export default app
export { FileInfo }