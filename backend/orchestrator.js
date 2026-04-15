import { generateText, tool } from "ai";
import { z } from "zod";
import { model } from "./utils/model.js";
import summaryAgent from "./agents/summaryAgent.js";
import emailContentAgent from "./agents/emailContentAgent.js";
import sendEmail from "./utils/sendEmail.js";

const runOrchestrator = async (reportData, ngoEmail) => {
  console.log("\n🚀 [Orchestrator] Multi-Agent Workflow Started");
  console.log(ngoEmail);
  console.log(reportData);
  console.log(model);
  console.log("summaryAgent type:", typeof summaryAgent);
console.log("emailContentAgent type:", typeof emailContentAgent);
console.log("sendEmailFn type:", typeof sendEmail);
  const { text, steps } = await generateText({
    model,
    maxSteps: 5,
    toolChoice: "auto",
    system: `You are the Master Orchestrator for TreeTrace's environmental monitoring system.
You coordinate a team of specialized AI agents and tools.

Follow this exact workflow:
STEP 1 — Call summaryAgent to summarize the GEE report and detect tree loss.
STEP 2 — Read the result:
  - If loss_detected is TRUE  → call emailContentAgent to generate email content, then call sendEmailTool to send it.
  - If loss_detected is FALSE → stop here. Do not call any other agent or tool.
STEP 3 — Return a plain-English final status of everything that happened.`,
    prompt: `Process this GEE report. Pass the fields directly to summaryAgent.
mean_ndvi_change: ${cleanReport.mean_ndvi_change}
mean_ndmi_change: ${cleanReport.mean_ndmi_change}
area_of_loss_m2: ${cleanReport.area_of_loss_m2}
mean_z_score: ${cleanReport.mean_z_score}
locationName: ${cleanReport.locationName}
NGO Email: ${ngoEmail}`,
    tools: {
      summaryAgent: tool({
        description:
          "Summarizes the GEE report and detects whether tree loss occurred",
        parameters: z.object({
          reportData: z.object({
            mean_ndvi_change: z.number(),
            mean_ndmi_change: z.number(),
            area_of_loss_m2: z.number(),
            mean_z_score: z.number(),
            locationName: z.string(),
          }),
        }),
        execute: async ( reportData ) => {
           try {
    const result = await summaryAgent(reportData);
    console.log("\n[SummaryAgent Tool] Result:", JSON.stringify(result));
    return result;
  } catch (err) {
    console.error("\n[SummaryAgent Tool] ERROR:", err.message);
    return { error: err.message };
  }
        },
      }),
      emailContentAgent: tool({
        description:
          "Generates professional email subject and body for NGO notification",
        parameters: z.object({
          summary: z.string(),
          locationName: z.string(),
        }),
        execute: async ({ summary, locationName }) => {
          const result = await emailContentAgent({ summary, locationName });
          console.log("\n[Orchestrator] EmailContentAgent done.");
          return result;
        },
      }),
      sendEmailTool: tool({
        description:
          "Sends the generated email to the NGO. Call after emailContentAgent.",
        parameters: z.object({
          email: z.string().email(),
          subject: z.string(),
          body: z.string(),
        }),
        execute: async ({ email, subject, body }) => {
          const result = await sendEmail({ email, subject, body });
          console.log(
            "\n[Orchestrator] sendEmailTool done. Status:",
            result.status,
          );
          return result;
        },
      }),
    },
  });
steps.forEach((step, i) => {
  console.log(`\nStep ${i + 1}:`);
  console.log("  Tool calls:", step.toolCalls?.map(t => t.toolName));
  console.log("  Tool results:", JSON.stringify(step.toolResults?.map(r => r.result), null, 2));
});
  console.log("✅ [Orchestrator] Workflow Complete");
  return {
    orchestratorSummary: text,
  };
};

export default runOrchestrator;
