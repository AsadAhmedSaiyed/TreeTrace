import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { analyze } from "./controllers/analyzeController.js";
dotenv.config();
import cors from "cors";
const url = process.env.MONGO_URI;
const app = express();
const PORT = process.env.PORT || 5000;
import ee from "@google/earthengine";
import fs from "fs";
import ReportModel from "./models/ReportModel.js";
const keyFile = process.env.GEE_KEY_PATH;
console.log("keyFile : ", keyFile);
let initialized = false;

async function initGEE() {
  if (!initialized) {
    const privateKeyData = JSON.parse(fs.readFileSync(keyFile, "utf8"));
    await new Promise((resolve, reject) => {
      ee.data.authenticateViaPrivateKey(
        privateKeyData,
        () => {
          ee.initialize(
            null,
            null,
            () => {
              initialized = true;
              console.log("GEE initialized");
              resolve();
            },
            reject
          );
        },
        reject
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
app.get("/report/:id", async (req, res) => {
  let start = Date.now();
  try {
    let { id } = req.params;
    const report = await ReportModel.findById(id).lean();
    if (!report) {
      return res.status(404).json({
        message: "Report Not found!",
      });
    }
    console.log(Date.now()-start);
    return res.status(200).json({
      success: true,
      report,
    });
  } catch (e) {
    console.error("Error while fetching report : ", e.message);
    return res.status(500).json({
      message: "Server error while fetching report!",
    });
  }
});
app.post("/analyze", analyze);


// Connect to MongoDB and start server
async function connectToDb() {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
   
    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });

    await initGEE();
  } catch (err) {
    console.error("Connection failed!", err);
  }
}

connectToDb();
