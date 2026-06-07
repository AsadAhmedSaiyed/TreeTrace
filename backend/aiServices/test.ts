import { runPipeline } from "./src/pipeline";
import { v4 as uuidv4 } from "uuid";
import type { ReportData } from "./src/types";
const main = async() : Promise<void> =>{
    let email = "saiyedasadahmed313@gmail.com";
 const reportData: ReportData = {
  center_point: {
    type: "Point",
    coordinates: [
      73.08654785156251,
      22.426262526205846
    ]
  },

  locationName: "Grünheide",
  beforeDate: "2026-06-01T00:00:00.000Z",
  afterDate: "2026-06-07T00:00:00.000Z",

  before_image:
    "https://res.cloudinary.com/dwy5iqutt/image/upload/v1780807473/tree-trace/before/xibrmz1alg1ybezr74ee.png",

  after_image:
    "https://res.cloudinary.com/dwy5iqutt/image/upload/v1780807473/tree-trace/after/aniq04bev85j6f3neuup.png",

  ndvi_diff_image:
    "https://res.cloudinary.com/dwy5iqutt/image/upload/v1780807474/tree-trace/diff/m1zr3ypuxnxinny5luqv.png",

  mean_ndvi_change: -0.00006784043957060154,
  mean_evi_change: -0.0013369383375144846,
  mean_ndmi_change: -0.0012400071703053508,
  mean_ndbi_change: 0.0012400071703053508,
  mean_nbr_change: -0.0006103476566174844,
  mean_z_score: -1.924084080171666,

  historical_baseline_mu: 0.33973738006094933,
  historical_variability_sigma: 0.033181292209764124,

  area_of_loss_m2: 0
};
    const requestId = uuidv4()
const result = await runPipeline(reportData, email, {
      runId: requestId,  // Ties API request ID to LangSmith trace
    });
console.log("Result : ",result);
};

main();