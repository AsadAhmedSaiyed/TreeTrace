import { graph } from "./graph.js";
import { createLogger } from "./utils/logger.js";
import type { ReportData, PipelineResult, PipelineOptions, DispatchStatus } from "./types.js";
import { create } from "node:domain";
import { report } from "node:process";

const logger = createLogger("Pipeline");

export const runPipeline = async (
  reportData: ReportData,
  ngoEmail:   string,
  options:    PipelineOptions = {}
): Promise<PipelineResult> => {

  const startTime = Date.now();

  const runId: string = options.runId ?? crypto.randomUUID();

  logger.info("Pipeline started", {
    run_id:    runId,
    location:  reportData.locationName,
    ngo_email: ngoEmail,
  });

  // ── Input Validation ────────────────────────────────────────
  // TypeScript types catch wrong types at compile time,
  // but these runtime checks catch edge cases like empty strings.
  if (!reportData || typeof reportData !== "object") {
    throw new Error("runPipeline: reportData must be a non-null object");
  }
  if (!ngoEmail || typeof ngoEmail !== "string") {
    throw new Error("runPipeline: ngoEmail must be a valid string");
  }

  try {

    const finalState = await graph.invoke(
      {
        // Seed the state with inputs
        reportData,
        ngoEmail,
        startedAt: new Date().toISOString(),
      },
      {
        // ── LangSmith Metadata ──────────────────────────────
        // Everything here shows up in your LangSmith dashboard.
        // runName appears as the trace title.
        runName: `treetrace-pipeline-${runId}`,

        // tags are filterable in LangSmith — filter by "production"
        // to see only real runs, not test runs
        tags: ["production", reportData.locationName ?? "unknown"],

        // metadata is searchable — paste a runId into LangSmith search
        // and find the exact trace for a failed request
        metadata: {
          run_id:    runId,
          location:  reportData.locationName,
          ngo_email: ngoEmail,
        },
      }
    );

    // ── Build Result ──────────────────────────────────────────
    const totalLatency: number = Date.now() - startTime;

    logger.info("Pipeline completed", {
      run_id:          runId,
      total_latency_ms: totalLatency,
      loss_detected:   finalState.lossDetected,
      // ?. optional chaining — safe if dispatchStatus is null
      // ?? "skipped" — fallback string if dispatchStatus is null
      dispatch_status: finalState.dispatchStatus?.status ?? "skipped",
      errors:          finalState.errors,
    });

    // Build a typed result object matching PipelineResult interface
    const result: PipelineResult = {
      runId,
      lossDetected:   finalState.lossDetected,
      summary:        finalState.summary,
      // If dispatchStatus is null (no loss path), return a "skipped" status
      dispatchStatus: finalState.dispatchStatus ?? { status: "skipped" },
      errors:         finalState.errors ?? [],
      meta: {
        totalLatency_ms: totalLatency,
        completedAt:     new Date().toISOString(),
      },
    };

    return result;

  } catch (error) {
    // Narrow the error type — TypeScript catch gives "unknown"
    const err = error instanceof Error ? error : new Error(String(error));

    logger.error("Pipeline failed with unhandled error", {
      run_id: runId,
      error:  err.message,
      stack:  err.stack,
    });

    // Re-throw — the Express API route handles the HTTP 500 response.
    // Don't swallow unhandled errors here — let them surface to the caller.
    throw err;
  }
};