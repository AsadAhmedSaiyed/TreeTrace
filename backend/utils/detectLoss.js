/**
 * Detects significant tree loss events using a weighted confidence model.
 *
 * @param {Object} report - The environmental impact report.
 * @returns {boolean} - True if significant loss is detected.
 */
export const detectTreeLoss = (report) => {
  // 1. Extract Metrics
  const ndviDrop = report.mean_ndvi_change; // e.g., -0.124
  const area = report.area_of_loss_m2;      // e.g., 1,430,231
  const zScore = Math.abs(report.mean_z_score);

  // 2. Define Dynamic Thresholds (The "MAANG" approach)
  // We use sigmoid-like logic: larger areas require less intense signal to be valid.

  // A. Magnitude Score (0.0 - 1.0)
  // We expect a drop of -0.15 for full clearing, but -0.05 is suspicious for large areas.
  // We clamp the value to avoid outliers skewing the result.
  const dropMagnitude = Math.min(Math.abs(ndviDrop) / 0.15, 1.0);

  // B. Impact Score (0.0 - 1.0)
  // Logarithmic scale for area because 100 hectares isn't 10x worse than 10 hectares; it's just "Huge".
  // Base threshold: 10,000 m² (1 hectare). Cap at 500,000 m² (50 hectares).
  const logArea = Math.log10(Math.max(area, 1));
  const minLog = 4; // 10,000 m²
  const maxLog = 5.7; // ~500,000 m²
  const areaWeight = Math.min(Math.max((logArea - minLog) / (maxLog - minLog), 0), 1);

  // C. Anomaly Score (0.0 - 1.0)
  // Z-Score gives us statistical significance.
  // 0.5 is weak, 2.0 is strong.
  const anomalyConfidence = Math.min(zScore / 1.5, 1.0);

  // 3. Calculate Weighted Probability
  // Formula: (Magnitude * 40%) + (Area * 40%) + (Anomaly * 20%)
  const confidence = (dropMagnitude * 0.4) + (areaWeight * 0.4) + (anomalyConfidence * 0.2);

  // 4. Decision Boundary
  // A confidence > 0.5 means "More likely than not" to be real loss.
  console.log(`Debug: Confidence Score: ${confidence.toFixed(2)}`);
  return confidence > 0.55;
};