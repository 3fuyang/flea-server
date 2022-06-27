import { Reportdata } from './entity/ReportData'
import { Orderdata } from './entity/OrderData'
import { Shoppingcart } from './entity/ShoppingCart'
import { Collectionbox } from './entity/CollectionBox'
import { Browsetrack } from './entity/BrowseTrack'
import { Goodinfo } from './entity/GoodInfo'
import { Chatrecord } from './entity/ChatRecord'
import { Adminaccount } from './entity/AdminAccount'
import { AppDataSource } from './data-source'
import { Useraccount } from './entity/UserAccount'

AppDataSource.initialize().then(async () => {
	console.log('Loading users from the database...')
	// Using EntityManager
	const users = await AppDataSource.manager.find(Useraccount)
	console.log('Loaded users: ', users)

	const admins = await AppDataSource.manager.find(Adminaccount)
	console.log('Loaded admins: ', admins)

	const chats = await AppDataSource.manager.find(Chatrecord)
	console.log('Loaded chats: ', chats)

	const goods = await AppDataSource.manager.find(Goodinfo)
	console.log('Loaded goods: ', goods)

	const history = await AppDataSource.manager.find(Browsetrack)
	console.log('Loaded history: ', history)

	const collection = await AppDataSource.manager.find(Collectionbox)
	console.log('Loaded favorite: ', collection)

	const shoppingcart = await AppDataSource.manager.find(Shoppingcart)
	console.log('Loaded shoppingcart: ', shoppingcart)

	const orders = await AppDataSource.manager.find(Orderdata)
	console.log('Loaded orders: ', orders)

	const reports = await AppDataSource.manager.find(Reportdata)
	console.log('Loaded reports: ', reports)

	console.log('Here you can setup and run express / fastify / any other framework.')
}).catch(error => console.log(error))
