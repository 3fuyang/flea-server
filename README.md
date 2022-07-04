# Flea Server

Fwio

## 简介

[TJ Flea](https://github.com/3fuyang/flea-market) 的后端，使用 [TypeORM](https://typeorm.io/)，[Express](https://expressjs.com/) 和 [Socket.IO](https://socket.io/) 框架，数据库使用 MySQL。

使用 ESLint 格式化代码。

## 运行方法

```shell
npm install

cd src

ts-node app.ts
```

## Structure

```
flea-server
├─ .eslintrc.json
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ app.ts    // 程序主入口
│  ├─ data-source.ts    // 数据库连接
│  ├─ entity    // 实体
│  ├─ migration
│  ├─ public    // 图片资源
│  └─ routes    // 接口路由
│     ├─ Admin    // 管理员接口
│     ├─ details.ts
│     ├─ home.ts
│     ├─ login.ts
│     ├─ result.ts
│     └─ User    // 普通用户接口
└─ tsconfig.json

```
