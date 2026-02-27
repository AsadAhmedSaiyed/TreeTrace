import { createOllama } from 'ai-sdk-ollama';

// 1. Create a custom provider pointing to your Kubernetes service
const customOllama = createOllama({
  baseURL: 'http://ollama-service:80', 
});

// 2. Initialize the execution model
export const model = customOllama('llama3.2:3b');

console.log("✅ ai-sdk-ollama provider initialized at http://ollama-service:80/api");