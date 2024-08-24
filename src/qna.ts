import { GoogleGenerativeAI } from '@google/generative-ai'
import { GEMINI_API_KEY, EMBEDDING_MODEL } from './config'
import { initDb } from './surreal'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({
  model: EMBEDDING_MODEL,
})

export async function storeRagQna(
  question: string,
  answer: string,
): Promise<void> {
  const db = await initDb()
  if (!db) {
    throw new Error('Database initialization failed')
  }

  const normAnswer = answer.trim().toLowerCase()
  const normQuestion = question.trim().toLowerCase()

  let answerRecord = null
  let [queryResult] = await db.query<any>(
    'SELECT VALUE id FROM rag_answer WHERE norm_answer = $normAnswer',
    { normAnswer },
  )
  if (!queryResult || queryResult.length == 0) {
    const [createResult] = await db.create<any>('rag_answer', {
      answer,
      norm_answer: normAnswer,
    })
    answerRecord = createResult.id
  } else {
    answerRecord = queryResult[0]
  }
  ;[queryResult] = await db.query<any>(
    'SELECT id, rag_answer FROM rag_qna WHERE norm_question = $normQuestion',
    { normQuestion },
  )
  if (queryResult.length == 0) {
    const embeddingResult = await model.embedContent(question)
    const vector = embeddingResult.embedding.values
    await db.create<any>('rag_qna', {
      question,
      question_vector: vector,
      norm_question: normQuestion,
      rag_answer: answerRecord,
    })
  } else {
    const qnaAnswerRecord = queryResult[0].rag_answer
    if (qnaAnswerRecord.id !== answerRecord.id) {
      await db.query<any>(
        'UPDATE rag_qna SET rag_answer = $answer WHERE norm_question = $normQuestion',
        {
          answer: answerRecord,
          normQuestion,
        },
      )
    }
  }
}
