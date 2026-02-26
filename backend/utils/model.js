import { createOllama } from 'ollama-ai-provider'; // Recommended provider for AI SDK

const ollama = createOllama({
  // Use the internal ClusterIP service name and port
  baseURL: 'http://ollama-service:11434/api', 
});

// Define the specific model instance
export const model = ollama('llama3.2:3b');

console.log("Model initialized for: llama3.2:3b");