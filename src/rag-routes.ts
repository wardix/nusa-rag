import { Hono } from 'hono'
import { getRagResponse } from './rag'

const app = new Hono()

app.get('/', async (c) => {
  const prompt = c.req.query('prompt')!
  const response = await getRagResponse(prompt, getBasicUser(c))
  return c.json({ response })
})

app.post('/', async (c) => {
  const { prompt } = await c.req.json()
  const response = await getRagResponse(prompt, getBasicUser(c))
  return c.json({ response })
})

function getBasicUser(c: any) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return ''
  }
  return atob(authHeader.split(' ')[1]).split(':')[0]
}

export default app
