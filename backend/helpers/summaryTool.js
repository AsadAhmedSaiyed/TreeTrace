import { tool, generateText } from "ai";
import { z } from "zod";
import getSummary from "./getSummary";

const getSummaryTool = tool({
  description:
    "Generates a MAANG-level executive summary for an environmental report and assesses tree loss.",
  // Inside your getSummaryTool definition:
  inputSchema: z.object({
    reportData: z
      .object({
        location: z
          .array(z.number())
          .describe("Longitude and Latitude coordinates [lng, lat]."),
        beforeDate: z
          .string()
          .describe("The starting date for the change analysis."),
        afterDate: z
          .string()
          .describe("The ending date for the change analysis."),

        // Corrected Environmental Indices Descriptions
        mean_ndvi_change: z
          .number()
          .describe(
            "Mean Normalized Difference Vegetation Index (NDVI) change."
          ),
        mean_evi_change: z
          .number()
          .describe("Mean Enhanced Vegetation Index (EVI) change."),
        mean_ndmi_change: z
          .number()
          .describe("Mean Normalized Difference Moisture Index (NDMI) change."),
        mean_ndbi_change: z
          .number()
          .describe("Mean Normalized Difference Built-up Index (NDBI) change."),
        mean_nbr_change: z
          .number()
          .describe("Mean Normalized Burn Ratio (NBR) change."),

        // Corrected Statistical and Area Descriptions
        mean_z_score: z
          .number()
          .describe(
            "Mean Z-score indicating statistical significance of change from baseline."
          ),
        historical_baseline_mu: z
          .number()
          .describe("Historical mean (mu) of the change metric."),
        historical_variability_sigma: z
          .number()
          .describe(
            "Historical standard deviation (sigma) of the change metric."
          ),
        area_of_loss_km2: z
          .number()
          .describe(
            "Calculated area of tree/vegetation loss in square kilometers."
          ),
      })
      .describe("The complete, structured data from the environmental report."),
  }),
  execute: getSummary
});

export default getSummaryTool;
