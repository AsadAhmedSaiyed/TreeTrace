import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import summaryAgentTool from "./summaryAgentTool.js";
import emailAgentTool from "./emailAgentTool.js";

const model = google("gemini-2.5-flash");

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

const runMainAgent = async (reportData, ngoEmail) => {
  console.log("🚀 Orchestrator started...");
  
  // --- STEP 1: ANALYSIS PHASE ---
  console.log("Phase 1: Analyzing Report...");
  const analysisResponse = await generateText({
    model,
    system: analystSystemPrompt,
    tools: { summaryAgent: summaryAgentTool },
    maxSteps: 2, // It only needs 1 step to call the tool
    prompt: `Analyze this report: ${JSON.stringify(reportData)}`,
  });

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
