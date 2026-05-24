import {ChatGoogle} from "@langchain/google";

export const model = new ChatGoogle({
    model : "gemini-2.5-flash",
    temperature: 0.2,
    maxRetries: 3
});

export type {BaseChatModel} from "@langchain/core/language_models/chat_models";
