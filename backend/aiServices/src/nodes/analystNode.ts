import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { model } from "../utils/model.js";
import { detectTreeLoss } from "../utils/detectLoss.js";
import { createLogger } from "../utils/logger.js";
import type { PipelineStateType } from "../state.js";
import type { NodeOutput } from "../types.js";

const logger = createLogger("AnalystNode");

const SYSTEM_PROMPT = `
You are TreeTrace AI, an environmental change analysis system for satellite-based vegetation monitoring.

Your role is to generate a concise, evidence-based environmental assessment using only the provided metrics.

Behavior Rules:
- Use strictly factual, scientific, and objective language.
- Never speculate beyond the supplied metrics.
- Never use emotional, alarmist, activist, or sensational wording.
- Treat the provided Ground Truth classification as the authoritative final assessment.
- Never contradict Ground Truth.

Ground Truth Handling:
- If Ground Truth is NO SIGNIFICANT LOSS:
  - State that vegetation conditions remain stable.
  - Describe small spectral variations as normal environmental fluctuation or baseline variability.
  - Avoid implying degradation, deforestation, or ecological damage.

- If Ground Truth is CRITICAL LOSS DETECTED:
  - State that the metrics indicate statistically significant vegetation degradation.
  - Reference affected vegetation indices and anomaly indicators objectively.
  - Describe the detected change as consistent with substantial vegetation reduction or land-cover disturbance.
  - Do not speculate about causes such as logging, wildfire, agriculture, or human activity unless explicitly provided.

Statistical Interpretation Rules:
- Small decimal changes alone should not be treated as meaningful environmental decline.
- Use Z-Score, historical baseline mean (μ), and variability sigma (σ) to contextualize anomaly severity.
- Mention vegetation decline only when supported by both:
  1. significant spectral index reduction, and
  2. statistically abnormal deviation from historical baseline behavior.

Output Constraints:
- Keep the response limited to exactly 3 sentences.
- Do not output bullet points, JSON, markdown, headings, warnings, or recommendations.
- Output plain text only.
`;

const USER_PROMPT = `
Ground Truth Classification:
{groundTruth}

Satellite Vegetation Metrics:
- Mean NDVI Change: {mean_ndvi_change}
- Mean EVI Change: {mean_evi_change}
- Mean NDMI Change: {mean_ndmi_change}
- Mean NDBI Change: {mean_ndbi_change}
- Mean NBR Change: {mean_nbr_change}

Statistical Indicators:
- Mean Z-Score: {mean_z_score}
- Historical Baseline Mean (μ): {historical_baseline_mu}
- Historical Variability Sigma (σ): {historical_variability_sigma}

Spatial Impact:
- Area of Loss: {area_of_loss_m2} square meters

Generate a strictly factual 3-sentence environmental assessment.
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  ["human", USER_PROMPT],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

export const analystNode = async (
  state: PipelineStateType,
): Promise<NodeOutput> => {
  const startTime = Date.now();
  logger.info("Analyst node started");
  try {
    const { reportData } = state;
    if (!reportData) {
      throw new Error("reportData is null — cannot run analyst node");
    }
    const lossDetected: boolean = detectTreeLoss(reportData);
    const cleanMetrics = {
      ndvi_change: reportData.mean_ndvi_change ?? 0, // ?? 0 = fallback to 0
      ndmi_change: reportData.mean_ndmi_change ?? 0,
      area_m2: reportData.area_of_loss_m2 ?? 0,
      z_score: reportData.mean_z_score ?? 0,
      evi_change: reportData.mean_evi_change ?? 0,
      ndbi_change: reportData.mean_ndbi_change ?? 0,
      nbr_change: reportData.mean_nbr_change ?? 0,
      historical_baseline_mu: reportData.historical_baseline_mu ?? 0,
      historical_variability_sigma:
        reportData.historical_variability_sigma ?? 0,
    };
    const summary: string = await chain.invoke({
      groundTruth: lossDetected
        ? "CRITICAL LOSS DETECTED"
        : "NO SIGNIFICANT LOSS. NORMAL FLUCTUATIONS.",
      ...cleanMetrics,
    });
    logger.info("Analyst node completed", {
      latency_ms: Date.now() - startTime,
      loss_detected: lossDetected,
    });
    return {
      summary: summary.trim(), // .trim() removes leading/trailing whitespace
      lossDetected, // shorthand for lossDetected: lossDetected
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Analyst node failed", { error: err.message });
    return {
      summary: "Automated summary unavailable. Please review raw metrics.",
      lossDetected: false,
      errors: [{ node: "analyst", message: err.message }],
    };
  }
};
