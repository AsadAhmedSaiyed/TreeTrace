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
