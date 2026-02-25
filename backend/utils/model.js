// backend/utils/model.js
import { groq } from '@ai-sdk/groq';

// This exports the Groq model for use throughout your app
// It automatically looks for process.env.GROQ_API_KEY
export const model = groq('llama-3.3-70b-versatile');