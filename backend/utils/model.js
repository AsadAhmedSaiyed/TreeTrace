// backend/utils/model.js
import { createOpenAI } from "@ai-sdk/openai";

// OpenRouter uses the OpenAI-compatible format
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY, 
});
// This model has the best global availability for East Asia clusters
export const model = openrouter("openrouter/free");