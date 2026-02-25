// backend/utils/model.js
import { groq } from '@ai-sdk/groq';
console.log("printing");
console.log(process.env.GROQ_API_KEY);
export const model = groq('llama-3.3-70b-versatile', {
  apiKey: process.env.GROQ_API_KEY, // Explicitly passing it here
});