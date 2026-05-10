import type { ReportData } from "../types.js";

export const detectTreeLoss = (report : ReportData) : boolean => {
  
  const ndviDrop = report.mean_ndvi_change; 
  const area = report.area_of_loss_m2;     
  const zScore = Math.abs(report.mean_z_score);

  const dropMagnitude = Math.min(Math.abs(ndviDrop) / 0.15, 1.0);

  
  const logArea = Math.log10(Math.max(area, 1));
  const minLog = 4; 
  const maxLog = 5.7; 
  const areaWeight = Math.min(Math.max((logArea - minLog) / (maxLog - minLog), 0), 1);

 
  const anomalyConfidence = Math.min(zScore / 1.5, 1.0);

  const confidence = (dropMagnitude * 0.4) + (areaWeight * 0.4) + (anomalyConfidence * 0.2);

  console.log(`Debug: Confidence Score: ${confidence.toFixed(2)}`);
  return confidence > 0.55;
};