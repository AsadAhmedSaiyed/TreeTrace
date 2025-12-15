import { generateText } from "ai";
const getSummary = async ({ reportData }) => {
    const model = "google/gemini-2.5-flash";
  const systemPrompt =
    "You are a senior environmental analyst. Your task is to generate a MAANG-level executive summary for the data. " +
    'Your output MUST be a single JSON object with two fields: "summary" and "loss_detected". ' +
    "Summary Rules: " +
    "1. Use a professional, data-driven tone. " +
    "2. The summary must be a maximum of three (3) concise sentences. " +
    "3. **Explicitly mention the key numerical metrics**: the mean NDVI change (vegetation), mean NDMI change (moisture), and the area lost in km². " +
    "4. Focus on the monitoring period and the overall significance of the observed change (using the Z-score). " +
    "Loss Detection Rule (Real-World Example): " +
    'Set "loss_detected" to TRUE if the "mean_ndvi_change" is less than -0.10 (indicating severe loss) AND the "area_of_loss_km2" is greater than 0.1 square kilometers (10 hectares). Otherwise, set it to FALSE.';
    const userPrompt = `Generate the summary and loss assessment for this data: ${JSON.stringify(reportData)}`;

    const response = await generateText({
        model,
        system :systemPrompt,
        prompt:userPrompt,
        config:{
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    summary: { type: "string" },
                    loss_detected: { type: "boolean" },
                },
                required: ["summary", "loss_detected"],
            },
        },
    });
    return JSON.parse(response.text);
};

export default getSummary;
