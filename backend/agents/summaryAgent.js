import { generateText } from "ai";
import { detectTreeLoss } from "../utils/detectLoss.js";
import { model } from "../utils/model.js";

const summaryAgent = async ({ reportData }) => {
  console.log("Generating summary...");

  const lossDetected = detectTreeLoss(reportData);

  // 1. PAYLOAD OPTIMIZATION: Stripping massive URLs and timestamps
  const cleanData = {
    ndvi_change: reportData.mean_ndvi_change,
    ndmi_change: reportData.mean_ndmi_change,
    area_m2: reportData.area_of_loss_m2,
    z_score: reportData.mean_z_score,
  };
  const { text } = await generateText({
    model,
    system: `You are a factual environmental data reporter for TreeTrace.
Write a strictly factual 3-sentence summary of the GEE report metrics.
Ground Truth: ${detected ? "TREE LOSS DETECTED" : "NO SIGNIFICANT LOSS DETECTED"}.
State the NDVI change, NDMI change, affected area, and z-score in your summary.
Do not use alarmist language. Do not wrap in JSON.`,
    prompt: `Data: ${JSON.stringify(cleanData)}`,
    abortSignal: AbortSignal.timeout(15000),
  });
  return { summary: text.trim(), loss_detected: lossDetected };
};

export default summaryAgent;
