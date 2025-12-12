import ee from "@google/earthengine";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const keyFile = process.env.GEE_KEY_PATH;

let initialized = false;

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
    image.reduceRegion({
      reducer: reducer,
      geometry: geometry,
      scale: scale,
      maxPixels: 1e13
    }).evaluate((data, err) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

async function initGEE() {
  if (!initialized) {
    const privateKeyData = JSON.parse(fs.readFileSync(keyFile, "utf8"));
    await new Promise((resolve, reject) => {
      ee.data.authenticateViaPrivateKey(privateKeyData, () => {
        ee.initialize(null, null, () => {
          initialized = true;
          console.log("GEE initialized");
          resolve();
        }, reject);
      }, reject);
    });
  }
}

// --- 2. Improved Cloud Masking ---
function maskS2clouds(image) {
  const qa = image.select("QA60");
  const cloudBitMask = 1 << 10;
  const cirrusBitMask = 1 << 11;
  const mask = qa.bitwiseAnd(cloudBitMask).eq(0)
    .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  
  return image.updateMask(mask).divide(10000)
    .select(["B2", "B3", "B4", "B8", "B8A", "B11"]) // Added B11/B8A for future index use
    .copyProperties(image, ["system:time_start"]);
}

// --- 3. Main Logic ---

export const analyze = async (req, res) => {
  try {
    const { bounds, dates } = req.body;
    
    // Case 0: Input Validation
    if (!bounds || !dates?.before || !dates?.after) {
      return res.status(400).json({ error: "Missing bounds or dates parameters." });
    }

    await initGEE();

    // Define Geometry
    const geometry = ee.Geometry.Rectangle([
      bounds._southWest.lng,
      bounds._southWest.lat,
      bounds._northEast.lng,
      bounds._northEast.lat,
    ]);

    // --- Critical Fix: Safe Image Fetcher ---
    // This function checks if data exists BEFORE processing
    const getSafeComposite = async (dateStr, label) => {
      const startDate = ee.Date(dateStr);
      // Increased window to 3 months to reduce "No Data" errors
      const endDate = startDate.advance(3, "month"); 

      const collection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterDate(startDate, endDate)
        .filterBounds(geometry)
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 50)) // Relaxed cloud filter
        .map(maskS2clouds);

      // ASYNC CHECK: Does this collection have images?
      const count = await evaluate(collection.size());

      if (count === 0) {
        throw new Error(`No clear satellite images found for '${label}' date (${dateStr}) in this region. Try a different date range.`);
      }

      // If safe, return the composite
      return collection.median().clip(geometry);
    };

    // Case 1: Fetch Images (Parallel execution with Error Handling)
    let beforeImg, afterImg;
    try {
      [beforeImg, afterImg] = await Promise.all([
        getSafeComposite(dates.before, "Before"),
        getSafeComposite(dates.after, "After")
      ]);
    } catch (fetchErr) {
      // Handle "No Data" case gracefully by sending 404 to client
      console.warn("Data fetch failed:", fetchErr.message);
      return res.status(404).json({ 
        success: false, 
        error: "Satellite Data Unavailable", 
        details: fetchErr.message 
      });
    }

    // Case 2: Calculation (Now safe because images are guaranteed to exist)
    const calcNDVI = (img) => img.normalizedDifference(["B8", "B4"]).rename("NDVI");
    const ndviBefore = calcNDVI(beforeImg);
    const ndviAfter = calcNDVI(afterImg);
    
    // Subtract: After - Before (Positive = Growth, Negative = Loss)
    const ndviChange = ndviAfter.subtract(ndviBefore).rename("NDVI_Change");

    // Visualization Parameters
    const visParamsRGB = { bands: ["B4", "B3", "B2"], min: 0.0, max: 0.3, gamma: 1.4 };
    const visParamsNDVI = { min: -0.5, max: 0.5, palette: ["red", "white", "green"] };

    // Case 3: Processing & URL Generation
    const [beforeUrl, afterUrl, diffUrl, stats] = await Promise.all([
      getUrl(beforeImg, { ...visParamsRGB, dimensions: 512, region: geometry, format: 'png' }),
      getUrl(afterImg, { ...visParamsRGB, dimensions: 512, region: geometry, format: 'png' }),
      getUrl(ndviChange, { ...visParamsNDVI, dimensions: 512, region: geometry, format: 'png' }),
      getRegionStats(ndviChange, geometry, ee.Reducer.mean(), 20)
    ]);

    // Success Response
    res.json({
      success: true,
      data: {
        before_image: beforeUrl,
        after_image: afterUrl,
        ndvi_diff_image: diffUrl,
        mean_ndvi_change: stats.NDVI_Change
      }
    });

  } catch (err) {
    // Case 4: Catch-all for Server Errors (Auth failure, GEE timeout)
    console.error("GEE Server Error:", err);
    res.status(500).json({ error: "Internal Analysis Error", details: err.message });
  }
};