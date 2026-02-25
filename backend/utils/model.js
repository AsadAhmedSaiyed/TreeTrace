// backend/utils/model.js
import { groq } from '@ai-sdk/groq';

export const model = groq('llama-3.3-70b-versatile', {
  apiKey: process.env.GROQ_API_KEY,
  headers: {
    'User-Agent': 'Mozilla/5.0 (VercelAI-Agent)', // Helps bypass basic Cloudflare blocks
  },
});