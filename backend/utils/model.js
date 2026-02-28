import { createOllama } from 'ai-sdk-ollama';
import { AzureOpenAI } from "openai";
import { createAzure } from '@ai-sdk/azure';
console.log(process.env.AZURE_OPENAI_API_KEY);
// 1. Initialize the Azure provider using your resource name
const azureProvider = createAzure({
  resourceName: 'treetracellm', 
  apiKey: process.env.AZURE_OPENAI_API_KEY, 
});

// 2. Export the execution model using your deployment name
// This fully replaces the Ollama model while keeping the same 'model' variable export
export const model = azureProvider('gpt-4o-2');

console.log("Model : ");
