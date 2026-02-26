import { ollama } from 'ai-sdk-ollama';

export const model = ollama('llama3.2:3b', { 
  // Direct Cluster-IP is the most reliable path inside K8s
  baseURL: 'http://10.0.171.41:80/api', 
});

console.log("✅ Connection established to Cluster-IP: 10.0.171.41:80");