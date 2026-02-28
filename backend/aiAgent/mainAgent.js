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
// 2. COMMUNICATIONS AGENT: Updated to bypass content filters
const commsSystemPrompt = `
You are a technical Environmental Reporting Officer. 
Your ONLY job is to call the "emailAgent" to transmit data findings to an NGO.
Provide a neutral, data-driven description of the vegetation health metrics.
Do not use alarmist, urgent, or persuasive language. Stick to the statistical facts.
`;

const runMainAgent = async (reportData, ngoEmail) => {
  console.log("🚀 Orchestrator started...");
let start = Date.now();
  // --- STEP 1: GET SUMMARY DIRECTLY (No tools needed) ---
  const sum = await getSummary({ reportData });
  console.log("✅ Summary:", sum);
console.log(Date.now()-start);
  const lossDetected = sum.loss_detected;
  const generatedSummary = sum.summary;
  const result = lossDetected 
    ? "ANALYSIS COMPLETE: Loss detected. Alerting NGO in background." 
    : "ALL CLEAR: No loss detected.";

  // --- STEP 2: LOGIC GATE ---
  if (!lossDetected) {
    return { result, generatedSummary };
  }

  // --- STEP 3: ACTION PHASE ---
  const sendEmailInBackground = async (summaryText, email) => {
    try {
      await generateText({
        model,
        system: commsSystemPrompt,
        tools: { emailAgent: emailAgentTool },
        prompt: `Send alert to ${email}. Context: ${summaryText}, Location name : ${reportData.locationName}`,
      });
      console.log("✅ Background Alert Sent.");
    } catch (error) {
      console.error("❌ Background Alert Failed:", error.message);
    }
  };

  console.log("Handoff to background worker...");
  sendEmailInBackground(generatedSummary, ngoEmail);

  return { result, generatedSummary };
};

export default runMainAgent;

const test = async ()=>{
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
  console.log("Result : ",res);  
};

test();