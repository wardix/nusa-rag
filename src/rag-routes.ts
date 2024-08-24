import { Hono } from 'hono'
import { getRagResponse } from './rag'

const app = new Hono()

app.get('/', async (c) => {
  const prompt = c.req.query('prompt')!
  const response = await getRagResponse(prompt)
  return c.json({ response })
})

app.post('/', async (c) => {
  const { prompt } = await c.req.json()
  const response = await getRagResponse(prompt)
  return c.json({ response })
})

export default app
