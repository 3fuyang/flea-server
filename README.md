# Flea Server

Fwio

## Introduction

Back-end for TJ Flea. Built by TypeORM, Express and Socket.IO.

Steps to run this project:

1.  Run `npm i` command

2.  Setup database settings inside `data-source.ts` file

3.  Run `npm start` command

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

