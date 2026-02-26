import { generateText } from "ai";
import summaryAgentTool from "./summaryAgentTool.js";
import emailAgentTool from "./emailAgentTool.js";
import { model } from "../utils/model.js";

const analystSystemPrompt = `
You are an expert Data Analyst for TreeTrace. 
Your ONLY job is to call the "summaryAgent" to analyze the report data.
Return the raw findings. Do not make decisions.
`;

const commsSystemPrompt = `
You are the Communications Officer. 
Your ONLY job is to call the "emailAgent" to send an alert based on the summary provided.
Use the summary to write a persuasive body text.
`;

/**
 * Custom Error Handler to diagnose AKS/Ollama issues
 */
const handleAIError = (error, phase) => {
  console.error(`--- 🚨 Root Cause Analysis (${phase}) ---`);
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    console.error("RESULT: Request Timed Out.");
    console.error("REASON: Your AKS CPU is taking > 3 mins to generate or load the model.");
  } else if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
    console.error("RESULT: Network Connection Refused.");
    console.error("REASON: Backend cannot find the Ollama service. Check your baseURL.");
  } else {
    console.error(`RESULT: ${error.message}`);
  }
  console.error("---------------------------------------");
};

const runMainAgent = async (reportData, ngoEmail) => {
  console.log("🚀 Orchestrator started...");
  
  // --- PHASE 1: ANALYSIS ---
  console.log("Phase 1: Analyzing Report (Requesting Llama 3.2)...");
  
  let analysisResponse;
  try {
    analysisResponse = await generateText({
      model,
      system: analystSystemPrompt,
      tools: { summaryAgent: summaryAgentTool },
      maxSteps: 2,
      prompt: `Analyze this report: ${JSON.stringify(reportData)}`,
      // Give the CPU 3 minutes to perform the math
      abortSignal: AbortSignal.timeout(180000), 
    });
  } catch (error) {
    handleAIError(error, "Analysis Phase");
    return {
      result: "❌ Error: AI analysis connection failed.",
      generatedSummary: "Check backend logs for timeout or network errors.",
    };
  }

  // Safely extract tool results
  const summaryStep = analysisResponse.steps.find((step) =>
    step.toolResults?.some((res) => res.toolName === "summaryAgent"),
  );

  if (!summaryStep) {
    console.error("❌ Logic Error: Model replied but didn't trigger the summary tool.");
    return { result: "❌ Error: Tool calling failed.", generatedSummary: "" };
  }

  const toolOutput = summaryStep.toolResults[0].output;
  const lossDetected = toolOutput.loss_detected;
  const generatedSummary = toolOutput.summary;

  // --- LOGIC GATE ---
  if (!lossDetected) {
    console.log("✅ No loss detected. Sequence ending.");
    return {
      result: "ALL CLEAR: No loss detected.",
      generatedSummary,
    };
  }

  // --- PHASE 2: BACKGROUND ALERTING ---
  const sendEmailInBackground = async (summary, email) => {
    try {
      console.log("Phase 2: Generating Email Alert...");
      await generateText({
        model,
        system: commsSystemPrompt,
        tools: { emailAgent: emailAgentTool },
        prompt: `Send alert to ${email}. Context: ${summary}, Location: ${reportData.locationName}`,
        abortSignal: AbortSignal.timeout(120000), // 2 min timeout for email gen
      });
      console.log("✅ Background Alert Sent Successfully.");
    } catch (error) {
      handleAIError(error, "Email Phase");
    }
  };

  if (lossDetected) {
    console.log("⚠️ Loss detected. Handing off to background worker...");
    // Fires and forgets, but handles its own errors
    sendEmailInBackground(generatedSummary, ngoEmail);

    return {
      result: "ANALYSIS COMPLETE: Loss detected. Alerting NGO in background.",
      generatedSummary,
    };
  }
};

export default runMainAgent;