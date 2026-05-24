export interface ReportData {
  center_point: {
    type: "Point";
    coordinates: [number, number];
  };
  locationName: string;
  beforeDate: string;
  afterDate: string;
  before_image: string;
  after_image: string;
  ndvi_diff_image: string;
  mean_ndvi_change: number;
  mean_evi_change: number;
  mean_ndmi_change: number;
  mean_ndbi_change: number;
  mean_nbr_change: number;
  mean_z_score: number;
  historical_baseline_mu: number;
  historical_variability_sigma: number;
  area_of_loss_m2: number;
}

export interface NodeOutput {
  summary?: string;
  lossDetected?: boolean;
  emailSubject?: string;
  emailBody?: string;
  dispatchStatus?: DispatchStatus;
  errors?: PipelineError[];
}

export interface DispatchStatus {
  status: "success" | "error" | "skipped";
  messageId?: string;
  sentAt?: string;
  message?: string;
  failedAt?: string;
}

export interface PipelineError {
  node: string;
  message: string;
}

export interface PipelineResult {
  runId: string;
  lossDetected: boolean;
  summary: string | null;
  dispatchStatus: DispatchStatus;
  errors: PipelineError[];
  meta: {
    totalLatency_ms: number;
    completedAt: string;
  };
}

export interface PipelineOptions {
  runId?: string;
}

export interface EmailContent {
  subject: string;
  body: string;
}
