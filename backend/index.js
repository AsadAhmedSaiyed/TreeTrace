import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { analyze } from "./controllers/analyzeController.js";
dotenv.config();
import {
  clerkClient,
  clerkMiddleware,
  requireAuth,
  getAuth,
} from "@clerk/express";
import UserModel from "./models/UserModel.js";
import runMainAgent from "./aiAgent/mainAgent.js";
import cors from "cors";
import NGOModel from "./models/NGOModel.js";
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
            reject,
          );
        },
        reject,
      );
    });
  }
}

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(clerkMiddleware());
app.get("/reports/:id", requireAuth(), async (req, res) => {
  try {
    let { id } = req.params;
    const report = await ReportModel.findById(id).lean();
    if (!report) {
      return res.status(404).json({
        message: "Report Not found!",
      });
    }
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
app.patch("/reports/:id", requireAuth(), async (req, res) => {
  try {
    let { id } = req.params;
    const { updates } = req.body;
    const report = await ReportModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    console.log(report);
    if (!report) {
      return res.status(404).json({
        message: "Report Not found!",
      });
    }
    return res.status(200).json({
      success: true,
      report,
    });
  } catch (e) {
    console.error("Error while updating report : ", e.message);
    return res.status(500).json({
      message: "Server error while updating report!",
    });
  }
});
app.post("/analyze", requireAuth(), analyze);
app.post("/reports/:id/generate-summary", requireAuth(), async (req, res) => {
  const start = Date.now();
  try {
    console.log("Fetching summary");
    const { id } = req.params;
    const { reportData, email } = req.body;
    console.log("Report Data : ", reportData);
    const result = await runMainAgent(reportData, email);
    console.log(result);
    console.log(Date.now() - start);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (e) {
    console.error("Error while generating summary : ", e.message);
    return res.status(500).json({
      message: "Server error while generating summary!",
    });
  }
});

app.post("/users/save-user", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { role } = req.body;

    if (!["STANDARD_USER", "NGO_MANAGER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const username = clerkUser.firstName || "User";

    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        role: role,
      },
    });

    const user = await UserModel.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId: userId,
        email: email,
        username: username,
        role: role,
      },
      { upsert: true, new: true },
    );
    res.json({
      success: true,
      message: "Role updated and user saved to database",
      user: user,
    });
  } catch (e) {
    console.error("Error setting role:", e);
    res.status(500).json({ message: "Failed to set role" });
  }
});

app.post("/ngo/register",async (req,res)=>{
  try {
    const { name, email, center_point } = req.body;

    // 1. Validation: Ensure all fields exist
    if (!name || !email || !center_point || !center_point.coordinates) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide name, email, and valid location coordinates." 
      });
    }

    // 2. Check for Duplicates (Optional but recommended)
    const existingNGO = await NGOModel.findOne({ email });
    if (existingNGO) {
      return res.status(400).json({ 
        success: false, 
        message: "An NGO with this email is already registered." 
      });
    }

    // 3. Create the new NGO
    const newNGO = await NGOModel.create({
      name,
      email,
      center_point: {
        type: "Point", // Force type to be 'Point'
        coordinates: center_point.coordinates // [Lng, Lat]
      }
    });

    res.status(201).json({
      success: true,
      message: "NGO registered successfully!",
      ngoId:newNGO._id, 
    });

  } catch (error) {
    console.error("Registration Error:", error);
  
    res.status(500).json({ 
      success: false, 
      message: "Server Error. Could not register NGO." 
    });
  }
});

app.get("/ngo/nearest", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "Latitude and Longitude are required" });
    }

    const nearestNGO = await NGOModel.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
        },
      },
    }).select("email name");

    if (!nearestNGO) {
      return res.status(404).json({ message: "No NGO found nearby." });
    }

    res.status(200).json({
      success: true,
      ngo: nearestNGO,
    });
  } catch (e) {
    console.error("Error in searching nearest NGO : ", e);
    res.status(500).json({ message: "Failed find nearest NGO" });
  }
});

// Add this before app.listen()
app.get("/", (req, res) => {
  res.send("TreeTrace Backend is Running 🌳");
});

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
