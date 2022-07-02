import { Goodinfo } from './../../entity/GoodInfo'
import { Shoppingcart } from './../../entity/ShoppingCart'
/* ShoppingCart 页面 */
import * as express from 'express'
import { AppDataSource } from '../../data-source'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 检查商品是否已在购物车中
app.post('/checkInCart', async (req, res) => {
  const count = await AppDataSource
    .getRepository(Shoppingcart)
    .createQueryBuilder('cart')
    .where('cart.userId = :uid or cart.goodId = :gid', { uid: req.body.userID, gid: req.body.goodID })
    .getCount()

  const exist = count > 0 ? true : false

  res.end(JSON.stringify(exist))
})

// 加入购物车
app.post('/addToCart', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(Shoppingcart)
    .values({
      userId: req.body.userID,
      goodId: req.body.goodID,
      dayTime: req.body.time
    })
    .execute()

  res.end(JSON.stringify(result))
})

// 接口16 获取购物车：传入（用户ID） 返回（购物车商品列表与简要信息）
app.get('/getCart/:user_id', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Shoppingcart)
    .createQueryBuilder('cart')
    .leftJoinAndSelect(Goodinfo, 'good', 'cart.goodId = good.goodId')
    .select([
      'cart',
      'good.title',
      'good.price',
      'good.images'
    ])
    .where('cart.userId = :uid', { uid: req.params.user_id })
    .orderBy('cart.dayTime', 'DESC')
    .getRawMany()

  res.end(JSON.stringify(result))
})

// 接口17 从购物车移除某商品：传入（用户ID，商品ID） 返回（null）
app.get('/removeCart/:user_id/:good_id', async (req, res) => {
  const result = await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(Shoppingcart, 'cart')
    .where('cart.userId = :uid and cart.goodId = :gid', { uid: req.params.user_id, gid: req.params.good_id })
    .execute()

  res.send(JSON.stringify(result))
})

export default app