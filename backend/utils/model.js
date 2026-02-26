import { ollama } from 'ai-sdk-ollama';

export const model = ollama('llama3.2:3b', { // Match the 3B model you pulled
  // Removed the space and kept it as a clean string
  baseURL: 'http://57.158.82.64/api', 
});