// backend/utils/model.js
import { createOpenAI } from "@ai-sdk/openai";

// OpenRouter uses the OpenAI-compatible format
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY, 
});
console.log("OPEN : ",openrouter);
console.log("API KEY : ",process.env.OPENAI_API_KEY);
// Using Gemini 2.0 Flash (Stable and supported via OpenRouter)
export const model = openrouter("anthropic/claude-3.5-sonnet");