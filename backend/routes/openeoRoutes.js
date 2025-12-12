import express from "express";
import * as openeo from "@openeo/js-client";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/**
 * POST /api/openeo/ndvi-diff
 * Body: {
 *   "bbox": { "west": 72.95, "south": 22.55, "east": 72.97, "north": 22.56 },
 *   "date1": "2025-09-01",
 *   "date2": "2025-10-23"
 * }
 */
router.post("/ndvi-diff", async (req, res) => {
  try {
    const { bbox, date1, date2 } = req.body;
    if (!bbox || !date1 || !date2)
      return res.status(400).json({ error: "bbox, date1, and date2 are required." });

    console.log("🛰 Connecting to openEO backend...");

    // 1️⃣ Connect to openEO backend (Copernicus or Earth Engine)
    const connection = await openeo.connect("https://earthengine.openeo.org");
    await connection.authenticateBasic(
      process.env.OPENEO_USERNAME || "group11",
      process.env.OPENEO_PASSWORD || "test123"
    );

    console.log("✅ Authenticated successfully");

    // 2️⃣ Create process builder
    const builder = await connection.buildProcess();

    // 3️⃣ Load Sentinel-2 collection for both dates
    const cube1 = builder.load_collection(
      "COPERNICUS/S2",
      bbox,
      [date1, date1],
      ["B04", "B08"] // RED = B04, NIR = B08
    );

    const cube2 = builder.load_collection(
      "COPERNICUS/S2",
      bbox,
      [date2, date2],
      ["B04", "B08"]
    );

    // 4️⃣ Compute NDVI for both cubes
    const ndvi1 = builder.apply(cube1, new openeo.Formula("(B08 - B04) / (B08 + B04)"));
    const ndvi2 = builder.apply(cube2, new openeo.Formula("(B08 - B04) / (B08 + B04)"));

    // 5️⃣ Compute NDVI difference (date2 - date1)
    const diff = builder.subtract(ndvi2, ndvi1);

    // 6️⃣ Save as GeoTIFF (for better accuracy than PNG)
    const result = builder.save_result(diff, "GTiff");

    // 7️⃣ Execute synchronously and download result
    console.log("🚀 Processing NDVI difference...");
    await connection.downloadResult(result, "ndvi_difference.tif");

    console.log("✅ NDVI difference saved as ndvi_difference.tif");

    res.json({
      message: "NDVI difference computed successfully.",
      file: "ndvi_difference.tif",
      note: "You can serve or visualize this GeoTIFF on frontend using leaflet or rasterjs.",
    });
  } catch (err) {
    console.error("❌ Error in NDVI diff route:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
