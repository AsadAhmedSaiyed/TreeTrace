import ee from "@google/earthengine";
import { saveToCloudinary } from "../utils/uploadUtil.js";
import dotenv from "dotenv";
import UserModel from "../models/UserModel.js";
import ReportModel from "../models/ReportModel.js";
import { getAuth } from '@clerk/express'
dotenv.config();

// --- Core Index Calculation Functions ---

// 1. Enhanced Vegetation Index (EVI) - Best for Greenness
const calcEVI = (img) => {
  // EVI is robust because it uses the Blue band (B2) to correct for haze/atmosphere.
  // Formula: 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
  const EVI = img.expression(
    "2.5 * ((B8 - B4) / (B8 + 6 * B4 - 7.5 * B2 + 1))",
    {
      B8: img.select("B8"), // Near-Infrared (NIR)
      B4: img.select("B4"), // Red
      B2: img.select("B2"), // Blue (for atmospheric correction)
    },
  );
  console.log("Finding EVI");
  return EVI.rename("EVI");
};

// 2. Normalized Difference Moisture Index (NDMI) - Water/Biomass
const calcNDMI = (img) => {
  // Uses Shortwave Infrared (SWIR1) to detect water content in plant tissue.
  // Formula: (NIR - SWIR1) / (NIR + SWIR1)
  console.log("Finding NDMI");
  return img.normalizedDifference(["B8", "B11"]).rename("NDMI");
};

// 3. Normalized Difference Built-up Index (NDBI) - Bare Ground/Built-up
const calcNDBI = (img) => {
  console.log("Finding NDBI");
  // Uses the inverse of NDMI to highlight non-vegetated surfaces.
  // Formula: (SWIR1 - NIR) / (SWIR1 + NIR)
  return img.normalizedDifference(["B11", "B8"]).rename("NDBI");
};

// 4. Normalized Burn Ratio (NBR) - Fire/Structural Change
const calcNBR = (img) => {
  console.log("Finding NBR");
  // Highly sensitive to moisture loss and ash/charcoal content after a burn.
  // Formula: (NIR - SWIR2) / (NIR + SWIR2)
  return img.normalizedDifference(["B8A", "B12"]).rename("NBR");
};

// --- END Core Index Calculation Functions ---

// --- 1. Robust Async Helpers ---

// Promisify GEE evaluation (Standard MAANG pattern for non-blocking ops)
const evaluate = (eeObject) => {
  return new Promise((resolve, reject) => {
    eeObject.evaluate((data, error) => {
      if (error) reject(new Error(`GEE Eval Error: ${error}`));
      else resolve(data);
    });
  });
};

const getUrl = (image, params) => {
  return new Promise((resolve, reject) => {
    image.getThumbURL(params, (url, err) => {
      if (err) reject(err);
      else resolve(url);
    });
  });
};

const getRegionStats = (image, geometry, reducer, scale) => {
  return new Promise((resolve, reject) => {
    image
      .reduceRegion({
        reducer: reducer,
        geometry: geometry,
        scale: scale,
        maxPixels: 1e13,
      })
      .evaluate((data, err) => {
        if (err) reject(err);
        else resolve(data);
      });
  });
};

// --- 2. Improved Cloud Masking ---
// --- 2. Improved Cloud Masking (Using SCL Band) ---
function maskS2clouds(image) {
  const scl = image.select("SCL");

  // SCL Classes Table:
  // 0: No Data, 1: Saturated / Defective
  // 2: Dark Area Pixels
  // 3: Cloud Shadows
  // 4: Vegetation, 5: Not Vegetated, 6: Water, 7: Unclassified
  // 8: Cloud Medium Probability, 9: Cloud High Probability
  // 10: Thin Cirrus, 11: Snow

  // We want to KEEP: 4 (Veg), 5 (Bare Soil), 6 (Water), 7 (Unclassified), 2 (Dark/Terrain), 11 (Snow)
  // We want to REMOVE: 1, 3 (Shadows), 8 (Clouds), 9 (Clouds), 10 (Cirrus)

  // Select classes to MASK (Keep only clear land/water)
  // Masking 3 (Shadows), 8, 9, 10 (Clouds)
  const mask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));

  return image
    .updateMask(mask)
    .divide(10000) // Scale to 0-1
    .select(["B2", "B3", "B4", "B8", "B8A", "B11", "B12"])
    .copyProperties(image, ["system:time_start"]);
}

// Function to calculate Historical Mean (mu) and Standard Deviation (sigma) for EVI
const getHistoricalStats = async (geometry, dates) => {
  // 1. Define the historical time window
  const beforeDate = ee.Date(dates.before);
  const endYear = beforeDate.get("year").getInfo(); // Get the year of your "Before" image (e.g., 2025)
  const startYear = endYear - 2; // Start 5 years prior (e.g., 2020)

  // Use the .get('month') to retrieve the month number (1-12)
  const startMonthNum = beforeDate.get("month").getInfo(); // Get the month number as a JS value

  // 2. Filter the historical satellite collection (Sentinel-2)
  const historicalCollection = ee
    .ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    .filter(ee.Filter.calendarRange(startYear, endYear, "year")) // Filter to the 5-year range
    .filter(ee.Filter.calendarRange(startMonthNum, startMonthNum, "month")) // Filter to the exact same season/month
    .filterBounds(geometry) // Only images that cover the user's area
    .map(maskS2clouds) // Apply your existing cloud mask to clean every historical image
    .map(calcEVI); // Apply the EVI calculation to every image

  // 3. Calculate the mean (mu) and standard deviation (sigma) of the entire historical dataset

  // mu: Calculates the average EVI across all images in the collection for every pixel.
  const muImage = historicalCollection.mean().clip(geometry).rename("mu");

  // sigma: Calculates the standard deviation of EVI across all images for every pixel.
  const sigmaImage = historicalCollection
    .reduce(ee.Reducer.stdDev())
    .clip(geometry)
    .rename("sigma");

  console.log("getting historical data!");
  // 4. Extract the regional mean statistics (as simple JavaScript numbers)
  // We get the average value of 'mu' and 'sigma' across the whole geometry.
  const [muStats, sigmaStats] = await Promise.all([
    getRegionStats(muImage, geometry, ee.Reducer.mean(), 100),
    getRegionStats(sigmaImage, geometry, ee.Reducer.mean(), 100),
  ]);

  // 5. Return the image objects (for Z-Score) and the scalar values (for the report)
  return {
    // Scalar values for the report
    mu: muStats.mu,
    sigma: sigmaStats.sigma,
    // GEE Image objects (needed for math in Step 2)
    muImage: muImage,
    sigmaImage: sigmaImage,
  };
};

// Function to calculate the total area of pixels that meet the loss criteria
const calculateAreaMetrics = (
  deltaIndex,
  ZScoreImage,
  geometry,
  lossThreshold,
  zScoreThreshold,
) => {
  // 1. Loss Condition: Delta Index (e.g., EVI) must be strongly negative (e.g., < -0.15)
  const indexLoss = deltaIndex.lt(lossThreshold);
  console.log("Calculating area loss");
  // 2. Statistical Condition: Z-Score must be highly unusual (e.g., < -2.0)
  const zScoreLoss = ZScoreImage.lt(zScoreThreshold);

  // 3. Combine both conditions to create the final mask (pixel must meet BOTH criteria)
  const lossMask = indexLoss.and(zScoreLoss).rename("Loss_Mask");

  // 4. Calculate Area (in km^2) only for the masked pixels
  const pixelArea = ee.Image.pixelArea().mask(lossMask);
  const aream2 = pixelArea.rename("Area_Loss_m2");

  return aream2;
};

// --- 3. Main Logic ---

export const analyze = async (req, res) => {
  const {userId} = getAuth(req);
  let start = Date.now();
  const user = await UserModel.findOne({clerkId : userId});
  try {
    const { bounds, dates, locationName } = req.body;
    console.log(locationName);
    // Case 0: Input Validation
    if (!bounds || !dates?.before || !dates?.after) {
      return res
        .status(400)
        .json({ error: "Missing bounds or dates parameters." });
    }

    // Define Geometry
    const geometry = ee.Geometry.Rectangle([
      bounds._southWest.lng, // left
      bounds._southWest.lat, //bottom
      bounds._northEast.lng, //right
      bounds._northEast.lat, //top
    ]);

    // --- Critical Fix: Safe Image Fetcher ---
    // This function checks if data exists BEFORE processing
    const getSafeComposite = async (dateStr, label) => {
      const centerDate = ee.Date(dateStr);
      // Increased window to 3 months to reduce "No Data" errors
      const startDate = centerDate.advance(-2, "month");
      const endDate = centerDate.advance(2, "month");

      const collection = ee
        .ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterDate(startDate, endDate)
        .filterBounds(geometry)
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 100)) // Relaxed cloud filter
        .map(maskS2clouds);

      // ASYNC CHECK: Does this collection have images?
      // const count = await evaluate(collection.size());

      // if (count === 0) {
      //   throw new Error(
      //     `No clear satellite images found for '${label}' date (${dateStr}) in this region. Try a different date range.`,
      //   );
      // }

      // If safe, return the composite
      return collection.median().clip(geometry);
    };

    // Case 1: Fetch Images (Parallel execution with Error Handling)
    let beforeImg, afterImg;
    try {
      [beforeImg, afterImg] = await Promise.all([
        getSafeComposite(dates.before, "Before"),
        getSafeComposite(dates.after, "After"),
      ]);
    } catch (fetchErr) {
      // Handle "No Data" case gracefully by sending 404 to client
      console.warn("Data fetch failed:", fetchErr.message);
      return res.status(404).json({
        success: false,
        error: "Satellite Data Unavailable",
        details: fetchErr.message,
      });
    }
    console.log("retrieved images");
    // Case 2: Calculation (Now safe because images are guaranteed to exist)
    const calcNDVI = (img) =>
      img.normalizedDifference(["B8", "B4"]).rename("NDVI");
    const ndviBefore = calcNDVI(beforeImg);
    const ndviAfter = calcNDVI(afterImg);

    // Subtract: After - Before (Positive = Growth, Negative = Loss)
    const ndviChange = ndviAfter.subtract(ndviBefore).rename("NDVI_Change");
    // 1. Get the Historical Mean (mu) and Variability (sigma)
    const historical = await getHistoricalStats(geometry, dates);
    // 2. Calculate the Z-Score Image (Surprise Factor)
    // Formula: Z = (Observed Value - Mean) / Standard Deviation
    // We use the EVI value of the 'Before' image as the "Observed Value" to see how unusual it is.
    const afterEVI = calcEVI(afterImg);

    // 2. Calculate the Z-Score Image: Z = (X - mu) / sigma
    // IMPORTANT: This creates the Z-Score map for every pixel.
    const ZScoreImage = afterEVI
      .subtract(historical.muImage) // Subtract the historical mean (mu) map
      .divide(historical.sigmaImage) // Divide by the historical variability (sigma) map
      .rename("ZScore");

    // Visualization Parameters
    const visParamsRGB = {
      bands: ["B4", "B3", "B2"],
      min: 0.0,
      max: 0.3,
      gamma: 1.4,
    };
    const visParamsNDVI = {
      min: -0.5,
      max: 0.5,
      palette: ["red", "yellow", "green"],
    };

    // 1. Calculate EVI Change (After minus Before)
    const deltaEVI = calcEVI(afterImg)
      .subtract(calcEVI(beforeImg))
      .rename("Delta_EVI");

    // 2. Calculate NDMI Change (A BIG DROP confirms biomass loss)
    const deltaNDMI = calcNDMI(afterImg)
      .subtract(calcNDMI(beforeImg))
      .rename("Delta_NDMI");

    // 3. Calculate NDBI Change (A BIG INCREASE confirms bare ground exposure)
    const deltaNDBI = calcNDBI(afterImg)
      .subtract(calcNDBI(beforeImg))
      .rename("Delta_NDBI");

    // 4. Calculate NBR Change (Used to detect major structural/fire damage)
    const deltaNBR = calcNBR(afterImg)
      .subtract(calcNBR(beforeImg))
      .rename("Delta_NBR");

    const areaLossm2Image = calculateAreaMetrics(
      deltaEVI,
      ZScoreImage,
      geometry,
      -0.15,
      -2.0,
    );
    console.log("getting data");
    // Case 3: Processing & URL Generation
    const [
      beforeUrl,
      afterUrl,
      diffUrl,
      stats,
      statsEVI,
      statsNDMI,
      statsNDBI,
      statsNBR,
      statsZScore,
      statsAreaLoss,
    ] = await Promise.all([
      getUrl(beforeImg, {
        ...visParamsRGB,
        dimensions: 512,
        region: geometry,
        format: "png",
      }),
      getUrl(afterImg, {
        ...visParamsRGB,
        dimensions: 512,
        region: geometry,
        format: "png",
      }),
      getUrl(ndviChange, {
        ...visParamsNDVI,
        dimensions: 512,
        region: geometry,
        format: "png",
      }),
      getRegionStats(ndviChange, geometry, ee.Reducer.mean(), 100),
      getRegionStats(deltaEVI, geometry, ee.Reducer.mean(), 100),
      getRegionStats(deltaNDMI, geometry, ee.Reducer.mean(), 100),
      getRegionStats(deltaNDBI, geometry, ee.Reducer.mean(), 100),
      getRegionStats(deltaNBR, geometry, ee.Reducer.mean(), 100),
      getRegionStats(ZScoreImage, geometry, ee.Reducer.mean(), 100),
      getRegionStats(areaLossm2Image, geometry, ee.Reducer.sum(), 100), // Sums the area
    ]);

    console.log("getting response from GEE");

    const uploadPromise = Promise.all([
      saveToCloudinary(beforeUrl, "tree-trace/before"),
      saveToCloudinary(afterUrl, "tree-trace/after"),
      saveToCloudinary(diffUrl, "tree-trace/diff"),
    ]).then(async ([permBefore, permAfter, permDiff]) => {
      console.log("Background upload complete. Updating DB...");
      await ReportModel.findByIdAndUpdate(newReport._id, {
        before_image: permBefore,
        after_image: permAfter,
        ndvi_diff_image: permDiff,
      });
      console.log("Images saved!");
    });

    const centerLat = (bounds._southWest.lat + bounds._northEast.lat) / 2;
    const centerLng = (bounds._southWest.lng + bounds._northEast.lng) / 2;

    const newReport = await ReportModel.create({
      userId:user._id,
      center_point: {
        type: "Point",
        coordinates: [centerLng, centerLat],
      },
      locationName,
      beforeDate: dates.before,
      afterDate: dates.after,
      before_image: beforeUrl,
      after_image: afterUrl,
      ndvi_diff_image: diffUrl,
      mean_ndvi_change: stats.NDVI_Change,
      mean_evi_change: statsEVI.Delta_EVI,
      mean_ndmi_change: statsNDMI.Delta_NDMI,
      mean_ndbi_change: statsNDBI.Delta_NDBI,
      mean_nbr_change: statsNBR.Delta_NBR,
      mean_z_score: statsZScore.ZScore,
      historical_baseline_mu: historical.mu,
      historical_variability_sigma: historical.sigma,
      area_of_loss_m2: statsAreaLoss.Area_Loss_m2,
    });

    console.log("✅ Report Saved:", newReport._id);
    console.log(Date.now() - start);
    res.status(201).json({ success: true, reportId: newReport._id });
  } catch (err) {
    // Case 4: Catch-all for Server Errors (Auth failure, GEE timeout)
    console.error("GEE Server Error:", err);
    res
      .status(500)
      .json({ error: "Internal Analysis Error", details: err.message });
  }
};
