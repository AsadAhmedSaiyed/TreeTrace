import runMainAgent from "./mainAgent.js";

const reportData = {
  location: [52.408500,  13.805000],
  beforeDate: "2019-06-01",
  afterDate: "2026-01-01",
  mean_ndvi_change:  -0.38414222594558767,
  mean_evi_change: -0.21007535158088433,
  mean_ndmi_change:  -0.06691114933586981,
  mean_ndbi_change: 0.06691114933586981,
  mean_nbr_change:  -0.241556554248018,
  mean_z_score: -4.0086315130351675,
  historical_baseline_mu: 0.3633727275031175,
  historical_variability_sigma:  0.093601624521499,
  area_of_loss_km2: 2.1975283838556305
};

try {
  const result = await runMainAgent(reportData, "asadahmedsaiyed786@gmail.com");
  
  console.log(" FINAL RESULT:");
  console.log(result); 
} catch (error) {
  console.error("\n❌ ERROR:");
  console.error(error);
}