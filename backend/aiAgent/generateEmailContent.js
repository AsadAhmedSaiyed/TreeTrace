import { google } from "@ai-sdk/google"; 
import { generateObject } from "ai";
import {z} from "zod";
const generateEmailContent = async ({ summary }) => {
    console.log("Generating email content...");
    const model = google("gemini-2.5-flash");
  const systemPrompt = `
   You are a Senior Environmental Communications Specialist. 
    Draft a high-stakes email alert for an NGO in a concise words.
    
    **SOURCE CONTENT:**
    Use this summary as your primary content: "${summary}"

    **STANDARDS:**
    1. Narrative Consistency: Use the provided summary as the 'Executive Summary'.
    2. Structure: Executive Summary -> Urgency Statement -> Immediate Action.
    3. Formatting: Use <strong> for emphasis and <p> for paragraphs in the HTML body.
    4. Output: Return a JSON object with "subject" and "body".
  `;
    const userPrompt = `Draft an email based on this report summary: ${summary}`;
    const response = await generateObject({
        model,
        system :systemPrompt,
        prompt:userPrompt,
       
        schema: z.object({
              subject: z.string(),
              body: z.string(),
            }),
    });
    console.log("email content generated", response.object);
    return response.object;
};

export default generateEmailContent;
