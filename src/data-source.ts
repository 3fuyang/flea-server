import "reflect-metadata"
import { DataSource } from "typeorm"

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
        __dirname + '/../**/*.entity.{js,ts}'
    ],
    migrations: [
        "src/migration/*.js"
    ],
    timezone: '+08:00',
    charset: 'utf8mb4'
})
