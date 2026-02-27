import { createOllama } from 'ai-sdk-ollama';
import { generateText } from 'ai';
import { ollama } from 'ai-sdk-ollama';
// 1. Create a custom provider pointing to your Kubernetes service
const customOllama = createOllama({
  baseURL: 'http://57.158.82.64:80', 
});

// 2. Initialize the execution model
export const model = customOllama('llama3.2:3b');

console.log("✅ ai-sdk-ollama provider initialized at http://ollama-service:80/api");
const { text } = await generateText({
  model : model,
  prompt: 'Write a haiku about coding',
  temperature: 0.8,
});

console.log(text);