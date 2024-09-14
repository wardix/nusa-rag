import { GoogleGenerativeAI } from '@google/generative-ai'
import { JSONCodec, connect } from 'nats'
import { initDb } from './surreal'
import {
  GEMINI_API_KEY,
  EMBEDDING_MODEL,
  SIMILARITY_THRESHOLD,
  GENERATIVE_MODEL,
  SYSTEM_INSTRUCTION_TEMPLATE,
  NATS_SERVERS,
  NATS_TOKEN,
} from './config'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const jc = JSONCodec()

async function getRelevantContext(question: string): Promise<any> {
  const model = genAI.getGenerativeModel({
    model: EMBEDDING_MODEL,
  })
  const db = await initDb()
  const embeddingResult = await model.embedContent(question)
  const vector = embeddingResult.embedding.values
  let context = ''
  let similarQuestion = ''
  let similarity = 0
  if (db) {
    const [queryResult] = await db.query<any>(
      'SELECT question, rag_answer.answer AS answer,' +
        ' vector::similarity::cosine(question_vector, $vector) AS similarity' +
        ' FROM rag_qna WHERE (question_vector <|1|> $vector)',
      { vector },
    )
    queryResult.forEach(
      ({
        question: questionValue,
        answer,
        similarity: similarityValue,
      }: any) => {
        similarQuestion = questionValue
        similarity = similarityValue
        if (similarity >= +SIMILARITY_THRESHOLD) {
          context = answer
        }
      },
    )
  }

  return {
    question: similarQuestion,
    similarity,
    context,
  }
}

async function generateResponse(
  question: string,
  systemInstruction: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: GENERATIVE_MODEL,
    systemInstruction,
  })
  const result = await model.generateContent(question)

  return result.response.text()
}

export async function getRagResponse(prompt: string): Promise<string> {
  const now = new Date()
  const { question, similarity, context } = await getRelevantContext(prompt)
  const systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE.replace(
    '{context}',
    context,
  )

  const response = await generateResponse(prompt, systemInstruction)
  const db = await initDb()
  if (db) {
    await db.create<any>('rag_log', {
      question: prompt,
      nearest_question: question,
      similarity,
      context,
      system: systemInstruction,
      response,
      created_at: now,
      updated_at: now,
    })
  }

  const nc = await connect({
    servers: NATS_SERVERS,
    token: NATS_TOKEN,
  })

  const js = nc.jetstream()
  await js.publish(
    'events.nusarag_retrieval_complete',
    jc.encode({
      time: now,
      question: prompt,
      mostSimilarQuestion: question,
      similarity,
      context,
      systemInstruction,
      response,
    }),
  )

  await nc.close()

  return response
}
