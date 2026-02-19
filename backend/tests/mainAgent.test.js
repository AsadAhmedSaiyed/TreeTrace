import runMainAgent from "../aiAgent/mainAgent";

test("Analyse report data to detect tree loss", async () => {
  const res = await runMainAgent({
      locationName: "anand",
      beforeDate: "2026-02-01T00:00:00.000Z",
      afterDate: "2026-02-19T00:00:00.000Z",
      mean_ndvi_change: -0.009015430834519498,
      mean_evi_change: -0.005449030044596847,
      mean_ndmi_change: -0.006045934914712434,
      mean_ndbi_change: 0.006045934914712434,
      mean_nbr_change: -0.002779398823444175,
      mean_z_score: 0.44257918538374935,
      historical_baseline_mu: 0.20332117060590058,
      historical_variability_sigma: 0.0243506400535911,
      area_of_loss_m2: 0,
    });
  expect(res).toEqual({
    result: "ALL CLEAR: No loss detected.",
    generatedSummary:expect.stringContaining("February 19, 2026"),
  });
},60000);
