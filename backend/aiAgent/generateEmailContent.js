import { google } from "@ai-sdk/google"; 
import { generateObject } from "ai";
import {z} from "zod";
const generateEmailContent = async ({ summary, locationName }) => {

    console.log("Generating email content...");
    console.log(locationName);
    const model = google("gemini-2.5-flash");
  const systemPrompt = `
   You are a Senior Environmental Communications Specialist. 
   Task: Convert satellite telemetry and summaries into high-stakes, concise email alerts for an NGO.
    
    **SOURCE CONTENT:**
    Primary Narrative: "${summary}"
    Raw Metrics: NDVI Change, Area, Z-Score.

    **STANDARDS:**
    1. Narrative Consistency: Use the provided summary as the 'Executive Summary'.
    2. Structure: Executive Summary -> Urgency Statement -> Immediate Action.
    3. Formatting: Use <strong> for emphasis and <p> for paragraphs in the HTML body.
    4. Conciseness: Total length must not exceed 150 words.
    5. Output: Return a JSON object with "subject" and "body".
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
