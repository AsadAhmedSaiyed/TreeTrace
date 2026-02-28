
import { generateObject } from "ai";
import {z} from "zod";
import { model } from "../utils/model.js";
const generateEmailContent = async ({ summary, locationName }) => {

    console.log("Generating email content...");
    console.log(locationName);

  const systemPrompt = `
  You are an Environmental Communications Specialist. 
  Task: Draft a professional and factual NGO alert based on satellite data.
  
  **STANDARDS:**
  1. Style: Professional, data-driven, and objective. 
  2. Structure: Executive Summary -> Data Analysis -> Recommended Next Steps.
  3. Formatting: Use <strong> for metrics and <p> for paragraphs.
  4. Conciseness: Maximum 150 words.
  5. Avoid: Do not use sensationalist or alarmist language. Stick to the statistical facts provided.
`;

    const userPrompt = `
    Draft a concise email alert for the location: ${locationName}. 
    Focus on the statistical significance (Z-Score) and the physical scale of the loss.
  `;
    
    const response = await generateObject({
        model,
        system :systemPrompt,
        prompt:userPrompt,
       
        schema: z.object({
              subject: z.string().describe("Urgent, data-heavy subject line including location name"),
              body: z.string().describe("HTML body, max 150 words, bulleted stats"),
            }),
    });
    console.log("email content generated", response.object);
    return response.object;
};

export default generateEmailContent;
