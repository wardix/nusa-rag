import { GoogleGenerativeAI } from '@google/generative-ai'
import { initDb } from './surreal'
import {
  GEMINI_API_KEY,
  EMBEDDING_MODEL,
  SIMILARITY_THRESHOLD,
  GENERATIVE_MODEL,
  SYSTEM_INSTRUCTION_TEMPLATE,
} from './config'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

async function getRelevantContext(question: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: EMBEDDING_MODEL,
  })
  const db = await initDb()
  const embeddingResult = await model.embedContent(question)
  const vector = embeddingResult.embedding.values
  let context = ''
  if (db) {
    const [queryResult] = await db.query<any>(
      'SELECT question, rag_answer.answer AS answer,' +
        ' vector::similarity::cosine(question_vector, $vector) AS similarity' +
        ' FROM rag_qna WHERE (question_vector <|1|> $vector)',
      { vector },
    )
    queryResult.forEach(({ answer, similarity }: any) => {
      if (similarity >= +SIMILARITY_THRESHOLD) {
        context = answer
      }
    })
  }

  return context
}

async function generateResponse(
  question: string,
  context: string,
): Promise<string> {
  const systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE.replace(
    '{context}',
    context,
  )
  const model = genAI.getGenerativeModel({
    model: GENERATIVE_MODEL,
    systemInstruction,
  })
  const result = await model.generateContent(question)

  return result.response.text()
}

export async function getRagResponse(prompt: string): Promise<string> {
  const context = await getRelevantContext(prompt)

  return generateResponse(prompt, context)
}
