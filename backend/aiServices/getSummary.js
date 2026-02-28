import { generateText } from "ai";
import { detectTreeLoss } from "../utils/detectLoss.js";
import { model } from "../utils/model.js";

const getSummary = async ({ reportData }) => {
  console.log("Generating summary...");
  
  const lossDetected = detectTreeLoss(reportData);

  // 1. PAYLOAD OPTIMIZATION: Stripping massive URLs and timestamps
  const cleanData = {
    ndvi_change: reportData.mean_ndvi_change,
    ndmi_change: reportData.mean_ndmi_change,
    area_m2: reportData.area_of_loss_m2,
    z_score: reportData.mean_z_score
  };

  // Inject the ground truth directly into the instructions
  const systemPrompt = `
You are a factual environmental data reporter.
Ground Truth: ${lossDetected ? "CRITICAL LOSS DETECTED" : "NO SIGNIFICANT LOSS. NORMAL FLUCTUATIONS."}

Write a strictly factual, 3-sentence summary using these metrics.
If Ground Truth is NO LOSS or Area is 0, you MUST state that vegetation health is stable and changes are within normal baseline limits. Do not exaggerate small decimals. 
Do not wrap in JSON.
  `;

  try {
    // 2. USE GENERATETEXT: Much faster than generateObject for single strings
    const response = await generateText({
      model,
      system: systemPrompt,
      prompt: `Data: ${JSON.stringify(cleanData)}`,
      abortSignal: AbortSignal.timeout(15000), // Enforce a strict 15-second limit
    });
    
    return {
      summary: response.text.trim(),
      loss_detected: lossDetected,
    };
  } catch (error) {
    console.error("Summary generation failed or timed out:", error.message);
    return {
      summary: "Automated summary unavailable due to high system load. Please review the raw metrics.",
      loss_detected: lossDetected,
    };
  }
};

export default getSummary;