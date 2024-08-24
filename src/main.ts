import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'
import { BASIC_USERS, PORT } from './config'
import rag from './rag-routes'
import qna from './qna-routes'

const app = new Hono()

const validUsers = new Set(JSON.parse(BASIC_USERS))
const verifyUser = (username: string, password: string, _c: any) =>
  validUsers.has(`${username}:${password}`)
const authMiddleware = basicAuth({ verifyUser })

app.use(logger())
app.use('/rag', authMiddleware)
app.use('/qna', authMiddleware)

app.get('/', (c) => {
  return c.text('OK')
})

app.route('/rag', rag)
app.route('/qna', qna)

export default {
  port: +PORT,
  fetch: app.fetch,
}
