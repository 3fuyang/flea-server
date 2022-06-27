import { Goodinfo } from './../entity/GoodInfo'
// Result页面的接口
import * as express from 'express'
import { AppDataSource } from '../data-source'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/getResult', async (req, res) => {
  const reqBody = req.body
  if ('keywords' in reqBody) {
    // 有关键词
    if ('filters' in reqBody) {
      // 有关键词，有筛选条件
      //console.log('有关键词，有筛选条件')
      const filters = reqBody.filters

      let sql = `select good_id,price,title,images from goodInfo where available=0 and title like '%${reqBody.keywords.split('').join('%')}%'`

      for (const property in filters) {
        if (property == 'onShelfTime') {
          switch (filters[property]) {
          case 'HalfYear':
            sql += ' and to_days(now()) - to_days(onshelf_time) <= 1'
            break
          case 'Month':
            sql += ' and DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(onshelf_time)'
            break
          case 'HalfMonth':
            sql += ' and DATE_SUB(CURDATE(), INTERVAL 15 DAY) <= date(onshelf_time)'
            break
          case 'Week':
            sql += ' and DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(onshelf_time)'
            break
          case 'Day':
            sql += ' and to_days(onshelf_time) = to_days(now())'
            break
          }
        } else if (property == 'minPrice') {
          sql += ` and price>=${filters[property]}`
        } else if (property == 'maxPrice') {
          sql += ` and price<=${filters[property]}`
        } else if (property == 'score') {
          sql += ' and ('
          filters[property].forEach((item: any) => {
            // 获取评分上、下界
            const [min, max] = item.split('-')
            sql += ` ((select rate from userAccount where user_id=goodInfo.seller_id)>=${min} and (select rate from userAccount where user_id=goodInfo.seller_id)<=${max}) or`
          })
          sql = sql.substring(0, sql.length - 3)
          sql += ')'
        } else {
          sql += ' and ('
          filters[property].forEach((item: any) => {
            sql += ` ${property}='${item}' or`
          })
          sql = sql.substring(0, sql.length - 3)
          sql += ')'
        }
      }

      const result = await AppDataSource.query(sql)

      res.end(JSON.stringify(result))
    } else {
      // 有关键词，无筛选条件
      const result = await AppDataSource
        .getRepository(Goodinfo)
        .createQueryBuilder('good')
        .select(['good.goodId', 'good.title', 'good.images', 'good.price'])
        .where('available = :available and title like :keywords')
        .setParameters({
          available: 0,
          keywords: `%${reqBody.keywords.split('').join('%')}%`
        })
        .getMany()

      console.log(AppDataSource
        .getRepository(Goodinfo)
        .createQueryBuilder()
        .select(['goodId', 'price', 'title', 'images'])
        .where('available = :available and title like :keywords')
        .setParameters({
          available: 0,
          keywords: `%${reqBody.keywords.split('').join('%')}%`
        }).getSql())

      res.end(JSON.stringify(result))
    }
  } else if ('filters' in reqBody) {
    // 无关键词，有筛选条件
    const filters = reqBody.filters
    //console.log('无关键词，有筛选条件')
    let sql = 'select good_id,price,title,images from goodInfo where available=0'
    for (const property in reqBody.filters) {
      if (property == 'onShelfTime') {
        switch (reqBody.filters[property]) {
        case 'HalfYear':
          sql += ' and to_days(now()) - to_days(onshelf_time) <= 1'
          break
        case 'Month':
          sql += ' and DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(onshelf_time)'
          break
        case 'HalfMonth':
          sql += ' and DATE_SUB(CURDATE(), INTERVAL 15 DAY) <= date(onshelf_time)'
          break
        case 'Week':
          sql += ' and DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(onshelf_time)'
          break
        case 'Day':
          sql += ' and to_days(onshelf_time) = to_days(now())'
          break
        }
      } else if (property == 'minPrice') {
        sql += ` and price>=${reqBody.filters[property]}`
      } else if (property == 'maxPrice') {
        sql += ` and price<=${reqBody.filters[property]}`
      } else if (property == 'score') {
        sql += ' and ('
        filters[property].forEach((item: any) => {
          // 获取评分上、下界
          const [min, max] = item.split('-')
          sql += ` ((select rate from userAccount where user_id=goodInfo.seller_id)>=${min} and (select rate from userAccount where user_id=goodInfo.seller_id)<=${max}) or`
        })
        sql = sql.substring(0, sql.length - 3)
        sql += ')'
      } else {
        sql += ' and ('
        reqBody.filters[property].forEach((item: any) => {
          sql += ` ${property}='${item}' or`
        })
        sql = sql.substring(0, sql.length - 3)
        sql += ')'
      }
    }

    const result = await AppDataSource.query(sql)

    res.end(JSON.stringify(result))
  } else {
    // 无关键词，无筛选条件
    //console.log('无关键词，无筛选条件')
    res.end(JSON.stringify(null))
  }
})

// 获取任意8个商品的简要信息，作为推荐列表
app.get('/getRecommendList', async (req, res) => {
  const result = await AppDataSource
    .getRepository(Goodinfo)
    .createQueryBuilder('goods')
    .select('goods')
    .where('available = :available', { available: 0 })
    .orderBy('RAND()')
    .limit(8)
    .getMany()

  res.end(JSON.stringify(result))
})

export default app