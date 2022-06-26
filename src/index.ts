import { Goodinfo } from './entity/Goodinfo';
import { Chatrecord } from './entity/ChatRecord';
import { Adminaccount } from './entity/AdminAccount'
import { AppDataSource } from "./data-source"
import { Useraccount } from "./entity/UserAccount"


AppDataSource.initialize().then(async () => {

    console.log("Loading users from the database...")
    // Using EntityManager
    const users = await AppDataSource.manager.find(Useraccount)
    console.log("Loaded users: ", users)

    const admins = await AppDataSource.manager.find(Adminaccount)
    console.log("Loaded admins: ", admins)

    const chats = await AppDataSource.manager.find(Chatrecord)
    console.log("Loaded chats: ", chats)

    const goods = await AppDataSource.manager.find(Goodinfo)
    console.log("Loaded goods: ", goods)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
