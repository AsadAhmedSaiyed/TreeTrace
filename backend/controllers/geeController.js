import ee from "@google/earthengine";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const keyFile = process.env.GEE_KEY_PATH;
console.log("keyFile : ", keyFile);
let initialized = false;

async function initGEE() {
  if (!initialized) {
    const privateKeyData = JSON.parse(fs.readFileSync(keyFile, "utf8"));
    const { client_email, private_key } = privateKeyData;

    await new Promise((resolve, reject) => {
      ee.data.authenticateViaPrivateKey(
        { client_email, private_key },
        () => {
          ee.initialize(
            null,
            null,
            () => {
              initialized = true;
              console.log("GEE initialized");
              resolve();
            },
            (err) => reject(err)
          );
        },
        (err) => reject(err)
      );
    });
  }
}

function maskS2clouds(image) {
  const qa = image.select("QA60");
  const cloudBitMask = 1 << 10; // Cloud
  const cirrusBitMask = 1 << 11; // Cirrus
  const mask = qa.bitwiseAnd(cloudBitMask).eq(0)
    .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image
    .updateMask(mask) // Remove clouds
    .divide(10000) // Scale reflectance to 0–1
    .select(["B2", "B3", "B4", "B8", "SCL"]) // Keep useful bands
    .copyProperties(image, ["system:time_start"]);
}


export const analyze = async (req, res) => {
  try {
    // const { bounds, dates } = req.body;
    // if (!bounds || !dates?.before || !dates?.after) {
    //   return res.status(400).json({ error: "Missing bounds or dates" });
    // }
    await initGEE();
//     const geometry = ee.Geometry.Rectangle([
//       bounds._southWest.lng,
//       bounds._southWest.lat,
//       bounds._northEast.lng,
//       bounds._northEast.lat,
//     ]);
//     const fetchImage = (date) => {
//       return ee
//         .ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
//         .filterDate(date, ee.Date(date).advance(1, "month"))
//         .filterBounds(geometry)
//         .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 40))
//         .map(maskS2clouds)
//         .median();
//     };
//     const before = fetchImage(dates.before);
//     const after = fetchImage(dates.after);
//     const calcNDVI = (img) =>
//       img.normalizedDifference(["B8", "B4"]).rename("NDVI");
//     const ndviBefore = calcNDVI(before);
//     const ndviAfter = calcNDVI(after);
//     const ndviChange = ndviAfter.subtract(ndviBefore);

//     const stats = ndviChange.reduceRegion({
//       reducer: ee.Reducer.mean(),
//       geometry,
//       scale: 10,
//       maxPixels: 1e13,
//     });

// const visParams = {
//   bands: ["B4","B3","B2"],
//   min: 0.05,
//   max: 0.3,
//   gamma: 1.2
// };


//     const imageOptions = {
//       scale:10,
//       region:geometry,
//       format:"png",
//       crs:"EPSG:4326",
//       maxPixels:1e13
//     };

//      const beforeRGB = before.select(["B4", "B3", "B2"]).visualize(visParams);
//     const afterRGB = after.select(["B4", "B3", "B2"]).visualize(visParams);

//     const beforeUrl = beforeRGB.getDownloadURL(imageOptions);

//     const afterUrl = afterRGB.getDownloadURL(imageOptions);

//     const ndviStats = await ndviChange
//       .reduceRegion({
//         reducer: ee.Reducer.minMax(),
//         geometry,
//         scale: 10,
//         maxPixels: 1e13,
//       })
//       .getInfo();

//     const ndviMin = ndviStats.NDVI_min;
//     const ndviMax = ndviStats.NDVI_max;

//     const diffUrl = ndviChange
//       .visualize({
//         min: ndviMin,
//         max: ndviMax,
//         palette: ["red", "orange", "yellow","lightgreen", "green"],
//       })
//       .getDownloadURL(imageOptions);
//     res.json({
//       meanNDVIChange: await stats.getInfo(),
//       beforeImage: beforeUrl,
//       afterImage: afterUrl,
//       ndviDiffImage: diffUrl,
//     });
      // Instantiate an image with the Image constructor.
var image = ee.Image('CGIAR/SRTM90_V4');

// Zoom to a location.
Map.setCenter(-112.8598, 36.2841, 9); // Center on the Grand Canyon.

// Display the image on the map.
Map.addLayer(image);
  } catch (err) {
    console.error("GEE Error : ", err);
    res.status(500).json({ error: err.message });
  }
};
