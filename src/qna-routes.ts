import { Hono } from 'hono'
import { storeRagQna } from './qna'

const app = new Hono()

app.post('/', async (c) => {
  const data = await c.req.json()
  try {
    if (Array.isArray(data)) {
      for (const {question, answer} of data) {
        await storeRagQna(question, answer)
      }
    } else {
      const { question, answer } = data
      storeRagQna(question, answer)
    }
    return c.json({
      message: 'Data received successfully',
    })
  } catch (e) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
