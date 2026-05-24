import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod"; // Zod = schema validation library
import { model } from "../utils/model.js";
import { createLogger } from "../utils/logger.js";
import type { PipelineStateType } from "../state.js";
import type { NodeOutput, EmailContent } from "../types.js";

const logger = createLogger("EmailContentNode");

const SYSTEM_PROMPT = `You are an Environmental Reporting Officer for TreeTrace.
Your task is to draft a technical report email for an NGO based on satellite vegetation analysis findings.

Standards:
1. Language: Objective, professional, and clinical. No alarmist or persuasive language.
2. Structure: Executive Summary → Statistical Breakdown → Next Steps.
3. Formatting: HTML using <strong> for metrics and <p> for paragraphs.
4. Conciseness: Maximum 150 words in the body.
5. Subject line: Standard technical report format. No "Urgent" or emotional qualifiers.`;

const USER_PROMPT = `Location: {locationName}

Executive Summary from Analysis:
{summary}

Draft the technical report email with subject and HTML body.`;

const emailSchema = z.object({
  subject: z
    .string()
    .describe(
      "Standard technical subject line e.g. 'TreeTrace Report: Vegetation Loss — [Location]'",
    ),
  body: z.string().describe("HTML-formatted technical body, max 150 words"),
});

type EmailOutput = z.infer<typeof emailSchema>;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  ["human", USER_PROMPT],
]);

const structuredModel = model.withStructuredOutput(emailSchema);

const chain = prompt.pipe(structuredModel);

export const emailContentNode = async (
  state: PipelineStateType,
): Promise<NodeOutput> => {
  const startTime = Date.now();
  logger.info("Email content node started");
  try {
    const { summary, reportData } = state;

    // Guard — summary must exist (set by analystNode before this runs)
    if (!summary || !reportData) {
      throw new Error("summary or reportData is null");
    }

    const result: EmailOutput = await chain.invoke({
      locationName: reportData.locationName ?? "Unknown Location",
      summary,
    });
    logger.info("Email content node completed", {
      latency_ms: Date.now() - startTime,
      subject: result.subject,
    });

    return {
      emailSubject: result.subject,
      emailBody: result.body,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Email content node failed", { error: err.message });

    // Fallback values — dispatchNode can still run with these
    return {
      emailSubject: "TreeTrace — Automated Report (Generation Failed)",
      emailBody:
        "<p>Email content generation failed. Please review raw data.</p>",
      errors: [{ node: "emailContent", message: err.message }],
    };
  }
};
