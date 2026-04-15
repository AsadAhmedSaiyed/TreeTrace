import { generateObject } from "ai";
import { z } from "zod";
import { model } from "../utils/model.js";
const emailContentAgent = async ({ summary, locationName }) => {
  console.log("Generating email content...");
  console.log(locationName);
  const { object } = await generateObject({
    model,
    schema: z.object({
      subject: z.string(),
      body: z.string(),
    }),
    system: `You are an environmental communications officer. 
Write a factual, data-driven email to an NGO about vegetation loss. 
No alarmist language. Stick to statistics.`,
    prompt: `Location: ${locationName}\nSummary: ${summary}`,
  });
  return object;
};

export default emailContentAgent;
