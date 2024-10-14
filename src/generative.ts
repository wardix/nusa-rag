import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  GEMINI_API_KEY,
} from './config'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function generateResponse(
  model: string,
  systemInstruction: string,
  question: string,
): Promise<string> {
  const genModel = genAI.getGenerativeModel({
    model,
    systemInstruction,
  })
  const result = await genModel.generateContent(question)

  return result.response.text()
}
