import { generateText } from "ai";
import { generateObject } from "ai";
const generateEmailContent = async ({ reportData }) => {
    const model = "google/gemini-2.5-flash";
  const systemPrompt = `
    You are a Senior Environmental Communications Specialist. 
    Your task is to draft a high-stakes email alert for an NGO.
    
    MAANG-Level Standards:
    1. Structure: Summary -> Key Metrics -> Action.
    2. Precision: Use exact coordinates, km² of loss, and Z-scores.
    3. Output: You MUST return a JSON object with "subject" and "body".
    
    HTML Body Requirements:
    - Use <strong> for labels.
    - Use <ul> for metrics.
  `;
    const userPrompt = `Generate a professional HTML email body for this report: ${JSON.stringify(reportData)}`;
    const response = await generateText({
        model,
        system :systemPrompt,
        prompt:userPrompt,
        config:{
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    subject: { type: "string" },
                    body: { type: "string" },
                },
                required: ["subject", "body"],
            },
        },
    });
    return JSON.parse(response.text);
};

export default generateEmailContent;
