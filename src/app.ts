import * as express from 'express'
import { Server } from 'socket.io'
import { AddressInfo } from 'net'

import loginAPI from './routes/login'
import resultAPI from './routes/result'
import homeAPI from './routes/home'
import detailAPI from './routes/details'

import reportAPI from './routes/Admin/report'

import chatAPI from './routes/User/chat'
import confirmAPI from './routes/User/confirm'
import favoriteAPI from './routes/User/favorite'
import goodsAPI from './routes/User/goods'
import historyAPI from './routes/User/history'
import infoAPI from './routes/User/info'
import orderAPI from './routes/User/order'
import securityAPI from './routes/User/security'
import cartAPI from './routes/User/shoppingcart'
import tradeAPI from './routes/User/trade'

const app = express()

app
// 配置图片等静态资源
  .use('/public', express.static('public'))
// 路由
  .use('/api',
    loginAPI,
    resultAPI,
    homeAPI,
    detailAPI,
    reportAPI,
    chatAPI,
    confirmAPI,
    favoriteAPI,
    goodsAPI,
    historyAPI,
    infoAPI,
    orderAPI,
    securityAPI,
    cartAPI,
    tradeAPI)

// 开启服务器
const server = app.listen(8082, () => {
  const host = (server.address() as AddressInfo).address
  const port = (server.address() as AddressInfo).port
  console.log('Server is running at http://%s:%s', host, port)
})

/* // 配置 Socket.io
const io = new Server({
  cors: {
    origin: 'http://106.15.78.201:8084'
  }
}).listen(server)

// WebSocket 连接桶
const sessionBucket = new Map<string, Set<string>>()

io.on('connection', (socket) => {
  // 建立 WebSocket 连接时，将用户ID和socket id加入map中，以便广播
  let userID = socket.handshake.headers.userid
  // 获取用户ID对应的连接集合
  let userSockets = sessionBucket.get(userID as string)
  if (!userSockets) {
    // 如果桶中不存在该用户对应的连接，则新建集合
    sessionBucket.set(userID as string, userSockets = new Set([socket.id]))
  } else {
    // 桶中存在该用户对应的连接集合，将 socket 连接加入集合
    userSockets.add(socket.id)
  }
  //console.log(`connect: ${socket.id}, userID: ${socket.handshake.headers.userid}`)

  // 用户发送消息
  socket.on('send message', (msg: Message) => {
    // 调试：打印消息
    //console.log(msg)

    // 将消息加入数据库
    let newMessage = [msg.a_user_id, msg.b_user_id, msg.speaker, msg.date_time, msg.details]
    connection.query(
      "insert into chatRecord(a_user_id,b_user_id,speaker,date_time,details) value(?,?,?,?,?)",
      newMessage,
      (err, result) => {
        if (err) throw err
        // 广播消息（仅针对消息双方）
        // 获取消息双方ID建立的所有socket连接
        const aSockets = sessionBucket.get(msg.a_user_id)
        const bSockets = sessionBucket.get(msg.b_user_id)
        const relatedSockets = [...(aSockets ? Array.from(aSockets) : []), ...(bSockets ? Array.from(bSockets) : [])]
        if (relatedSockets.length) {
          // 向相关连接发送消息
          io.to(relatedSockets).emit('deliver message', msg)
        }
      }
    )
  })

  socket.on('disconnect', () => {
    // 断开连接时，从集合中删除该连接
    (userSockets as Set<string>).delete(socket.id)
    //console.log(`disconnect: ${socket.id}`)
  })
}) */