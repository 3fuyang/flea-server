import { AppDataSource } from "./data-source"
import { Useraccount } from "./entity/UserAccount.entity"

AppDataSource.initialize().then(async () => {

    console.log("Loading users from the database...")
    // Using EntityManager
    const users = await AppDataSource.manager.find(Useraccount)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
