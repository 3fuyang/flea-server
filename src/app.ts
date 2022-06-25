import * as experss from 'express'
import { Request, Response } from 'express'

const app = experss()
app.use(experss.json())

app.get('/', async (req: Request, res: Response) => {
  res.end('<h1>Hello world</h1>')
})

app.listen(4369)