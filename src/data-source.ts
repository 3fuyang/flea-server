import "reflect-metadata"
import { DataSource } from "typeorm"
import { Useraccount } from "./entity/UserAccount"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "12345",
    database: "flea",
    synchronize: true,
    logging: false,
    entities: [
        Useraccount
    ],
    migrations: [
        "src/migration/*.js"
    ],
    timezone: '+08:00',
    charset: 'utf8mb4'
})
