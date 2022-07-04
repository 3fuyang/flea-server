import { ReportData } from './entity/ReportData'
import { OrderData } from './entity/OrderData'
import { ShoppingCart } from './entity/ShoppingCart'
import { CollectionBox } from './entity/CollectionBox'
import { BrowseTrack } from './entity/BrowseTrack'
import { GoodInfo } from './entity/GoodInfo'
import { ChatRecord } from './entity/ChatRecord'
import { AdminAccount } from './entity/AdminAccount'
import { AppDataSource } from './data-source'
import { UserAccount } from './entity/UserAccount'

AppDataSource.initialize().then(async () => {
  console.log('Loading users from the database...')
  // Using EntityManager
  const users = await AppDataSource.manager.find(UserAccount)
  console.log('Loaded users: ', users)

  const admins = await AppDataSource.manager.find(AdminAccount)
  console.log('Loaded admins: ', admins)

  const chats = await AppDataSource.manager.find(ChatRecord)
  console.log('Loaded chats: ', chats)

  const goods = await AppDataSource.manager.find(GoodInfo)
  console.log('Loaded goods: ', goods)

  const history = await AppDataSource.manager.find(BrowseTrack)
  console.log('Loaded history: ', history)

  const collection = await AppDataSource.manager.find(CollectionBox)
  console.log('Loaded favorite: ', collection)

  const shoppingcart = await AppDataSource.manager.find(ShoppingCart)
  console.log('Loaded shoppingcart: ', shoppingcart)

  const orders = await AppDataSource.manager.find(OrderData)
  console.log('Loaded orders: ', orders)

  const reports = await AppDataSource.manager.find(ReportData)
  console.log('Loaded reports: ', reports)

  console.log('Here you can setup and run express / fastify / any other framework.')
}).catch(error => console.log(error))
