
import { generateObject } from "ai";
import {z} from "zod";
import { model } from "../utils/model.js";
const generateEmailContent = async ({ summary, locationName }) => {

    console.log("Generating email content...");
    console.log(locationName);

const systemPrompt = `
  You are an Environmental Data Specialist. 
  Task: Document satellite telemetry findings into a structured email format for NGO records.
   
  **SOURCE CONTENT:**
  Executive Summary: "${summary}"
  Metrics: NDVI, Area, Z-Score.

  **STANDARDS:**
  1. Language: Use objective, professional, and clinical terminology.
  2. Structure: Executive Summary -> Statistical Breakdown -> Next Steps.
  3. Formatting: HTML using <strong> for metrics and <p> for paragraphs.
  4. Conciseness: Maximum 150 words.
  5. JSON Output: Return keys "subject" and "body".
`;

const userPrompt = `
  Draft a technical report email for: ${locationName}. 
  Include the Z-Score and the square meters of the recorded change.
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
