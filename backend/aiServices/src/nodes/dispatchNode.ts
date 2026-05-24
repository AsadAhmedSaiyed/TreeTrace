import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";
import type { NodeOutput, DispatchStatus } from "../types.js";
import type { PipelineStateType } from "../state.js";
import { createLogger } from "../utils/logger.js";
const resend = new Resend(process.env.RESEND_API_KEY);
const logger = createLogger("DispatchNode");

export const dispatchNode = async (
  state: PipelineStateType,
): Promise<NodeOutput> => {
  const startTime = Date.now();
  logger.info("Dispatch node started", { recipient: state.ngoEmail });
  try {
    const { ngoEmail, emailSubject, emailBody } = state;

    // Runtime validation — TypeScript types prevent wrong types,
    // but can't prevent null values from upstream failure fallbacks.
    // This guard throws before hitting the Resend API with bad data.
    if (!ngoEmail || !emailSubject || !emailBody) {
      throw new Error(
        "Missing required fields: ngoEmail, emailSubject, or emailBody",
      );
    }
    const { data, error } = await resend.emails.send({
      from: "TreeTrace <notifications@treetrace.tech>",
      to: [ngoEmail], // Resend expects an array of email strings
      subject: emailSubject,
      html: `
        <div style="font-family: 'Courier New', monospace; max-width: 640px;
                    margin: 0 auto; padding: 24px; background: #f9f9f9;
                    border-left: 4px solid #2d6a4f;">
          ${emailBody}
          <hr style="margin-top: 32px; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 11px; color: #888; margin-top: 16px;">
            Generated automatically by TreeTrace Satellite Monitoring System.
            Do not reply to this email.
          </p>
        </div>
      `,
    });

    // Resend returns error as a field, not by throwing — check it explicitly
    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }
    logger.info("Dispatch node completed", {
      latency_ms: Date.now() - startTime,
      message_id: data?.id,
    });
    const dispatchStatus: DispatchStatus = {
      status: "success",
      messageId: data?.id, // Resend's unique message ID
      sentAt: new Date().toISOString(),
    };

    return { dispatchStatus };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Dispatch node failed", { error: err.message });
    const dispatchStatus: DispatchStatus = {
      status: "error",
      message: err.message,
      failedAt: new Date().toISOString(),
    };
    return {
      dispatchStatus,
      errors: [{ node: "dispatch", message: err.message }],
    };
  }
};
