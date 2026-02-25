import { generateText, APICallError } from "ai";
import { model } from "../utils/model.js";
import summaryAgentTool from "./summaryAgentTool.js";
import emailAgentTool from "./emailAgentTool.js";

const runMainAgent = async (reportData, ngoEmail) => {
  console.log("🚀 Orchestrator started...");

  try {
    // --- STEP 1: ANALYSIS PHASE ---
    console.log("Phase 1: Analyzing Report...");
    
    const analysisResponse = await generateText({
      model,
      system: analystSystemPrompt,
      tools: { summaryAgent: summaryAgentTool },
      maxSteps: 5, // Increased slightly to allow for model "self-correction" if tool fails
      prompt: `Analyze this report: ${JSON.stringify(reportData)}`,
    });

    // Check if the model actually called the tool
    const summaryStep = analysisResponse.steps.find((step) =>
      step.toolResults?.some((res) => res.toolName === "summaryAgent"),
    );

    if (!summaryStep) {
      throw new Error("The model finished without calling the Summary Tool.");
    }

    const toolResult = summaryStep.toolResults.find(r => r.toolName === "summaryAgent");
    
    // Check if the tool execution itself failed internally
    if (!toolResult.success) {
      console.error("Tool Execution Error:", toolResult.error);
      return { result: "❌ Error: Summary Tool failed to execute logic.", error: toolResult.error };
    }

    const { loss_detected, summary } = toolResult.output;

    // --- STEP 2: LOGIC GATE ---
    if (!loss_detected) {
      return { result: "ALL CLEAR: No loss detected.", generatedSummary: summary };
    }

    // --- STEP 3: ACTION PHASE ---
    console.log("Handoff to background worker...");
    sendEmailInBackground(summary, ngoEmail, reportData.locationName);

    return {
      result: "ANALYSIS COMPLETE: Loss detected. Alerting NGO in background.",
      generatedSummary: summary,
    };

  } catch (error) {
    // --- SPECIAL HANDLING FOR "FORBIDDEN" (403) ---
    if (APICallError.isInstance(error) && error.statusCode === 403) {
      console.error("❌ Groq Forbidden: Check Model Permissions in Groq Console.");
      return { result: "❌ Forbidden: The model deployment is restricted.", error: error.message };
    }

    console.error("❌ Orchestrator Error:", error.message);
    return { result: "❌ Critical Failure", error: error.message };
  }
};

// Isolated background worker with its own handling
const sendEmailInBackground = async (summary, ngoEmail, locationName) => {
  try {
    await generateText({
      model,
      system: commsSystemPrompt,
      tools: { emailAgent: emailAgentTool },
      prompt: `Send alert to ${ngoEmail}. Context: ${summary}, Location: ${locationName}`,
    });
    console.log("✅ Background Alert Sent.");
  } catch (error) {
    console.error("❌ Background Alert Failed:", error.message);
  }
};