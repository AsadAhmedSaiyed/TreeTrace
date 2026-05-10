import { Annotation } from "@langchain/langgraph";
import type { ReportData, DispatchStatus, PipelineError } from "./types.js";

export const PipelineState = Annotation.Root({
  reportData: Annotation<ReportData | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  ngoEmail: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  summary: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  lossDetected: Annotation<boolean>({
    reducer: (_, next) => next,
    default: () => false,
  }),
  emailSubject: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  emailBody: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  dispatchStatus: Annotation<DispatchStatus | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  errors: Annotation<PipelineError[]>({
    reducer: (prev, next) => [...(prev ?? []), ...next],
    default: () => [],
  }),

  startedAt: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
});

export type PipelineStateType = typeof PipelineState.State;
