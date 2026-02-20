import { detectTreeLoss } from "../utils/detectLoss";

test("test detect tree loss function", () => {
  const res = detectTreeLoss({
    locationName: "anand",
    beforeDate: "2026-02-01T00:00:00.000Z",
    afterDate: "2026-02-20T00:00:00.000Z",
    mean_ndvi_change: -0.013529697928220504,
    mean_evi_change: -0.005696507884254989,
    mean_ndmi_change: -0.006393497077631907,
    mean_ndbi_change: 0.006393497077631907,
    mean_nbr_change: -0.002871656810564468,
    mean_z_score: 0.10410301305233988,
    historical_baseline_mu: 0.2735583673804922,
    historical_variability_sigma: 0.0491262057969278,
    area_of_loss_m2: 0,
  });
  expect(res).toBe(false);
});
