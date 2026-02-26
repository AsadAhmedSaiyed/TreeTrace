import { ollama } from 'ai-sdk-ollama';

// Add the 'export' keyword directly to the const
export const model = ollama('llama3.2:3b', { 
  baseURL: 'http://ollama-service:80/api', 
});

console.log("✅ Model initialized and exported as named export.");