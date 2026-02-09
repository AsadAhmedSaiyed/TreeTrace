export const detectTreeLoss = (report) => {
  const ndviDrop = report.mean_ndvi_change;
  const area = report.area_of_loss_m2;
  const ndbiRise = report.mean_ndbi_change;
  const zScore = Math.abs(report.mean_z_score);

  // If we only have 2 years of data, we lower the Z-score requirement 
  // and look for "Hard Evidence" (NDVI + NDBI)
  const isAnomalous = zScore >= 0.5; // Lowered from 1.96 because n is small
  const isDefiniteClearing = ndviDrop <= -0.15; 
  const isConstruction = ndbiRise >= 0.03;
  const isSignificantArea = area >= 50000;

  return (isDefiniteClearing && isSignificantArea) && (isAnomalous || isConstruction);
};
