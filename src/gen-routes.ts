import { Hono } from 'hono'
import { generateResponse } from './generative'

const app = new Hono()

app.post('/', async (c) => {
  const { model, question, systemInstruction } = await c.req.json()
  const response = await generateResponse(model, systemInstruction, question)
  return c.json({ response })
})

export default app
