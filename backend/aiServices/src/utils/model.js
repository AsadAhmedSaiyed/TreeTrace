import { createGoogleGenerativeAI } from "@ai-sdk/google";
console.log(process.env.GOOGLE_GENERATIVE_AI_API_KEY );
const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

export const model = google("gemini-2.5-flash");