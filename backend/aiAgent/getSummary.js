import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod"; // <--- FIXED: Added missing import

const getSummary = async ({ reportData }) => {
  console.log("Generating summary...");

  // <--- FIXED: Used stable model ID to prevent "404 Not Found"
  const model = google("gemini-2.5-flash");
  const lossDetected =
    reportData.mean_ndvi_change < -0.1 && reportData.area_of_loss_km2 > 0.1;
  const systemPrompt = `
     You are a senior environmental analyst.

Your task is to generate a MAANG-level executive summary for an environmental monitoring report.

RULES:
1. Use a professional, data-driven tone and simple words suitable for government bodies and NGOs.
2. The summary must be a maximum of three (3) concise sentences.
3. You MUST explicitly mention:
   - Mean NDVI change (vegetation health)
   - Mean NDMI change (moisture condition)
   - Area affected in square kilometers (km²)
4. Clearly reference the monitoring period using the provided dates.
5. Comment briefly on the statistical significance using the Z-score.
6. Do NOT make any judgment about alerting, severity thresholds, or loss classification.
7. Do NOT include recommendations or calls to action.

OUTPUT FORMAT:
Return a single JSON object with exactly one field:
{
  "summary": string
}
    `;
  const userPrompt = `Generate the summary and loss assessment for this data: ${JSON.stringify(reportData)}`;

  const response = await generateObject({
    model,
    system: systemPrompt,
    prompt: userPrompt,
    schema: z.object({
      summary: z.string(),
    }),
  });

  // <--- FIXED: Access 'response.object', not 'object'
  console.log("Summary generated:", response.object);
  console.log("Loss : ", lossDetected);

  return {
    summary: response.object.summary,
    loss_detected: lossDetected,
  };
};

export default getSummary;
