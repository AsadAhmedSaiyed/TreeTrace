import express from "express";
import dotenv from "dotenv";
import { analyze } from "./controllers/analyzeController.js";
import qs from "querystring"
import openeoRoute from "./routes/openeoRoutes.js";
dotenv.config();
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
import vegetationRoutes from "./routes/vegetation.js";
import ee from "@google/earthengine";
import fs from "fs";
dotenv.config();
const keyFile = process.env.GEE_KEY_PATH;
console.log("keyFile : ", keyFile);
let initialized = false;
const api_key = process.env.SPECTATOR_API_KEY;
const bbox = "19.59,49.90,20.33,50.21";
const url = `https://api.spectator.earth/imagery/?bbox=${bbox}&api_key=${api_key}`;

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

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
// app.use("/api/openeo", openeoRoute);
// app.use("/api/vegetation",vegetationRoutes);
app.post("/analyze", analyze);
app.get("/getToken",async (req,res) => {
    const body = qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "client_credentials",
    });
  const result = await fetch("https://services.sentinel-hub.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body
  });
  const data = await result.json();
  console.log(data);
  return res.json({token: data.access_token});
}
);
app.get("/getImg", async (req, res) => {
    console.log("Called!");
  const response = await fetch("https://services.sentinel-hub.com/api/v1/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
    body: JSON.stringify({
      input: {
        bounds: {
          bbox: [
            13.822174072265625, 45.85080395917834, 14.55963134765625,
            46.29191774991382,
          ],
        },
        data: [
          {
            type: "sentinel-2-l2a",
          },
        ],
      },
      evalscript: `
    //VERSION=3

    function setup() {
      return {
        input: ["B02", "B03", "B04"],
        output: {
          bands: 3
        }
      };
    }

    function evaluatePixel(
      sample,
      scenes,
      inputMetadata,
      customData,
      outputMetadata
    ) {
      return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
    }
    `,
    }),
  });
  
  console.log(response);
  const buffer = Buffer.from(await response.arrayBuffer());
  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
