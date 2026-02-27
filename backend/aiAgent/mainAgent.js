import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import summaryAgentTool from "./summaryAgentTool.js";
import emailAgentTool from "./emailAgentTool.js";
import { model } from "../utils/model.js";
import getSummary from "./getSummary.js";
// 1. ANALYST AGENT: Only responsible for analyzing data
const analystSystemPrompt = `
You are an expert Data Analyst for TreeTrace. 
Your ONLY job is to call the "summaryAgent" to analyze the report data.
Return the raw findings. Do not make decisions.
`;

// 2. COMMUNICATIONS AGENT: Only responsible for writing/sending emails
const commsSystemPrompt = `
You are the Communications Officer. 
Your ONLY job is to call the "emailAgent" to send an alert based on the summary provided.
Use the summary to write a persuasive body text.
`;

console.log("Model : ",model);

const runMainAgent = async (reportData, ngoEmail) => {
  console.log("🚀 Orchestrator started...");
 let analysisResponse;
  // --- STEP 1: ANALYSIS PHASE ---
  const sum = await getSummary({ reportData: reportData });
  console.log("Summary", sum);
  try{
    console.log("Phase 1: Analyzing Report...");
   analysisResponse = await generateText({
    model,
    system: analystSystemPrompt,
    tools: { summaryAgent: summaryAgentTool },
    toolChoice: "required",
    maxSteps: 2, // It only needs 1 step to call the tool
    maxRetries: 0,
    abortSignal: AbortSignal.timeout(10000),
    prompt: `Analyze this report: ${JSON.stringify(reportData)}`,
  });
  }catch (e) {
    console.error("--- 🚨 THE FINAL ERROR LOG ---");
    console.error("Message:", e.message);
    console.error("Cause:", e.cause); // This will show the low-level reason
    return {
      result: "❌ Error",
      generatedSummary: e.message
    };
  }

  console.log("analysis response : ",analysisResponse);

  // Extract the structured data from the tool result
  let lossDetected = false;
  let generatedSummary = "";
  let result = "";

  // Helper to find tool results safely
  const summaryStep = analysisResponse.steps.find((step) =>
    step.toolResults?.some((res) => res.toolName === "summaryAgent"),
  );

  if (summaryStep) {
    const toolOutput = summaryStep.toolResults[0].output;
    lossDetected = toolOutput.loss_detected;
    generatedSummary = toolOutput.summary;
    result = "ALL CLEAR: No loss detected.";
  } else {
    result = "❌ Error: Analysis failed to run.";
  }

  // --- STEP 2: LOGIC GATE (The "Deterministic" Part) ---
  if (!lossDetected) {
    return {
      result,
      generatedSummary,
    };
  }

  // --- STEP 3: ACTION PHASE ---
  const sendEmailInBackground = async (generatedSummary, ngoEmail) => {
    try {
      await generateText({
        model,
        system: commsSystemPrompt,
        tools: { emailAgent: emailAgentTool },
        prompt: `Send alert to ${ngoEmail}. Context: ${generatedSummary}, Location name : ${reportData.locationName}`,
      });
      console.log("✅ Background Alert Sent.");
    } catch (error) {
      // Log the error to a service like Sentry or Datadog
      console.error("❌ Background Alert Failed:", error.message);
    }
  };

  if (lossDetected) {
    console.log("Handoff to background worker...");

    // We call it without await, but the function HAS its own internal try/catch
    sendEmailInBackground(generatedSummary, ngoEmail);

    return {
      result: "ANALYSIS COMPLETE: Loss detected. Alerting NGO in background.",
      generatedSummary,
    };
  }
};

export default runMainAgent;
const test =  async () => {
  const res = await runMainAgent({
      locationName: "anand",
      beforeDate: "2026-02-01T00:00:00.000Z",
      afterDate: "2026-02-19T00:00:00.000Z",
      mean_ndvi_change: -0.009015430834519498,
      mean_evi_change: -0.005449030044596847,
      mean_ndmi_change: -0.006045934914712434,
      mean_ndbi_change: 0.006045934914712434,
      mean_nbr_change: -0.002779398823444175,
      mean_z_score: 0.44257918538374935,
      historical_baseline_mu: 0.20332117060590058,
      historical_variability_sigma: 0.0243506400535911,
      area_of_loss_m2: 0,
    });
  console.log("test : ",res);  
}

test();