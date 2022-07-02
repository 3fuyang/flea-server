import 'reflect-metadata'

import { Reportdata } from './entity/ReportData'
import { Orderdata } from './entity/OrderData'
import { DataSource } from 'typeorm'
import { Useraccount } from './entity/UserAccount'
import { Adminaccount } from './entity/AdminAccount'
import { Chatrecord } from './entity/ChatRecord'
import { Goodinfo } from './entity/GoodInfo'
import { Browsetrack } from './entity/BrowseTrack'
import { Collectionbox } from './entity/CollectionBox'
import { Shoppingcart } from './entity/ShoppingCart'

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12345',
  database: 'flea',
  synchronize: true,
  logging: false,
  entities: [
    Useraccount,
    Adminaccount,
    Chatrecord,
    Goodinfo,
    Browsetrack,
    Collectionbox,
    Shoppingcart,
    Orderdata,
    Reportdata
  ],
  migrations: [
    'src/migration/*.js'
  ],
  charset: 'utf8mb4',
  timezone: 'local'
})

AppDataSource.initialize()

export { AppDataSource }