import {ChatGoogle} from "@langchain/google";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.GOOGLE_API_KEY);
export const model = new ChatGoogle({
    model : "gemini-2.5-flash",
    temperature: 0.2,
    maxRetries: 3,
    thinkingConfig: {
    thinkingBudget: 0,  // disables thinking → ~1-2s
  },
});

export type {BaseChatModel} from "@langchain/core/language_models/chat_models";
