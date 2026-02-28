import { createOllama } from 'ai-sdk-ollama';

// 1. Create a custom provider pointing to your Kubernetes service
const customOllama = createOllama({
  baseURL: 'http://57.158.82.64:80', 
});

// 2. Initialize the execution model
export const model = customOllama('qwen2.5:1.5b');
