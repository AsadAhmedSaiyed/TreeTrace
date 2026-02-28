
export const detectTreeLoss = (report) => {
  
  const ndviDrop = report.mean_ndvi_change; // e.g., -0.124
  const area = report.area_of_loss_m2;      // e.g., 1,430,231
  const zScore = Math.abs(report.mean_z_score);

  const dropMagnitude = Math.min(Math.abs(ndviDrop) / 0.15, 1.0);

  
  const logArea = Math.log10(Math.max(area, 1));
  const minLog = 4; // 10,000 m²
  const maxLog = 5.7; // ~500,000 m²
  const areaWeight = Math.min(Math.max((logArea - minLog) / (maxLog - minLog), 0), 1);

 
  const anomalyConfidence = Math.min(zScore / 1.5, 1.0);

  // 3. Calculate Weighted Probability
  // Formula: (Magnitude * 40%) + (Area * 40%) + (Anomaly * 20%)
  const confidence = (dropMagnitude * 0.4) + (areaWeight * 0.4) + (anomalyConfidence * 0.2);

  // 4. Decision Boundary
  // A confidence > 0.5 means "More likely than not" to be real loss.
  console.log(`Debug: Confidence Score: ${confidence.toFixed(2)}`);
  return confidence > 0.55;
};