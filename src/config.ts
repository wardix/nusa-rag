export const PORT = process.env.PORT || 3000
export const SURREALDB_URL =
  process.env.SURREALDB_URL || 'http://localhost:8000/rpc'
export const SURREALDB_NAMESPACE = process.env.SURREALDB_NAMESPACE || 'ai'
export const SURREALDB_DATABASE = process.env.SURREALDB_DATABASE || 'rag'
export const SURREALDB_USERNAME = process.env.SURREALDB_USERNAME || 'root'
export const SURREALDB_PASSWORD = process.env.SURREALDB_PASSWORD || 'secret'

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'embedding-001'
export const GENERATIVE_MODEL =
  process.env.GENERATIVE_MODEL || 'gemini-1.5-flash'

export const SYSTEM_INSTRUCTION_TEMPLATE =
  process.env.SYSTEM_INSTRUCTION_TEMPLATE || ''

export const SIMILARITY_THRESHOLD = process.env.SIMILARITY_THRESHOLD || 0.6

export const BASIC_USERS = process.env.BASIC_USERS || '[]'

export const NATS_SERVERS = process.env.NATS_SERVERS || 'nats://localhost:4222'
export const NATS_TOKEN = process.env.NATS_TOKEN || ''
