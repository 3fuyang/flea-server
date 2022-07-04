import 'reflect-metadata'

import { ReportData } from './entity/ReportData'
import { OrderData } from './entity/OrderData'
import { DataSource } from 'typeorm'
import { UserAccount } from './entity/UserAccount'
import { AdminAccount } from './entity/AdminAccount'
import { ChatRecord } from './entity/ChatRecord'
import { GoodInfo } from './entity/GoodInfo'
import { BrowseTrack } from './entity/BrowseTrack'
import { CollectionBox } from './entity/CollectionBox'
import { ShoppingCart } from './entity/ShoppingCart'

const dbType = 'mysql'
const dbHost = ''
const dbUser = ''
const dbPort = 0
const dbPassword = ''
const dbName = ''

const AppDataSource = new DataSource({
  type: dbType,
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  synchronize: false,
  logging: false,
  entities: [
    UserAccount,
    AdminAccount,
    ChatRecord,
    GoodInfo,
    BrowseTrack,
    CollectionBox,
    ShoppingCart,
    OrderData,
    ReportData
  ],
  migrations: [
    'src/migration/*.js'
  ],
  charset: 'utf8mb4',
  timezone: 'local'
})

AppDataSource.initialize()

export { AppDataSource }