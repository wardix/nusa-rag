import { Hono } from 'hono'
import { storeRagQna } from './qna'

const app = new Hono()

app.post('/', async (c) => {
  const { question, answer } = await c.req.json()
  try {
    storeRagQna(question, answer)
    return c.json({
      message: 'Data received successfully',
    })
  } catch (e) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
