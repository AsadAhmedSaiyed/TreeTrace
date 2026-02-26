import { ollama } from 'ai-sdk-ollama';

const model = ollama('llama3.2:3b', { // Match the 3B model you pulled
  // Removed the space and kept it as a clean string
  baseURL: 'http://ollama-service:11434/api', 
});

export default model;

console.log("Model initialized...");