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
import ReportModel from "./models/ReportModel.js";
let initialized = false;

async function initGEE() {
  if (!initialized) {
    const privateKeyData = JSON.parse(process.env.GEE_JSON_CONTENT);
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
    console.log("Report : ",report);
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

// GET /my-reports - Fetch all reports for the logged-in user
app.get("/my-reports", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req); // Get Clerk ID (e.g., user_2b...)
    // 1. Find the MongoDB User ID associated with the Clerk ID
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }
    console.log(user.role);
    if (user.role === "STANDARD_USER") {
      const reports = await ReportModel.find({ userId: user._id }).sort({
        createdAt: -1,
      });
      console.log(reports);
      res.status(200).json({
        success: true,
        reports,
      });
    } else {
      const reports = await ReportModel.find({ ngoMgrId: user._id }).sort({
        createdAt: -1,
      });
      console.log(reports);
      res.status(200).json({
        success: true,
        reports,
      });
    }
  } catch (error) {
    console.error("Error fetching my reports:", error);
    res.status(500).json({ message: "Server error fetching reports" });
  }
});
app.patch("/reports/:id", requireAuth(), async (req, res) => {
  try {
    let { id } = req.params;
    const { updates } = req.body;
    console.log("new fields : ",updates);
    const report = await ReportModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!report) {
      return res.status(404).json({
        message: "Report Not found!",
      });
    }
    console.log("Updated report : ",report);
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

app.post("/ngo/register",requireAuth(), async (req, res) => {
  try {
    const { name, email, center_point } = req.body;
    const { userId } = getAuth(req);
    console.log("UserId : ",userId);
    const user = await UserModel.findOne({ clerkId: userId });
    console.log(user);
    if (user.role !== "NGO_MANAGER") {
      return res
        .status(403)
        .json({ message: "Only NGO Managers can register an NGO" });
    }
    // 1. Validation: Ensure all fields exist
    if (!name || !email || !center_point || !center_point.coordinates) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and valid location coordinates.",
      });
    }

    // 2. Check for Duplicates (Optional but recommended)
    const existingNGO = await NGOModel.findOne({ email });
    if (existingNGO) {
      return res.status(400).json({
        success: false,
        message: "An NGO with this email is already registered.",
      });
    }

    // 3. Create the new NGO
    const newNGO = await NGOModel.create({
      userId: user._id,
      name,
      email,
      center_point: {
        type: "Point", // Force type to be 'Point'
        coordinates: center_point.coordinates, // [Lng, Lat]
      },
    });
    console.log("New : ",newNGO);
    res.status(201).json({
      success: true,
      message: "NGO registered successfully!",
      ngoId: newNGO._id,
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error. Could not register NGO.",
    });
  }
});
app.get("/ngo-details", requireAuth(), async (req, res) => { // Added requireAuth() for safety
  try {
    const { userId } = getAuth(req);
    
    // 1. Safety Check: User might not exist in DB yet
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Role Check
    if (user.role !== "NGO_MANAGER") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Not an NGO Manager" });
    }
   console.log("User : ",user.email);
    // 3. Find NGO (Handle case where NGO profile is missing)
    const ngo = await NGOModel.findOne({ email: user.email });
      console.log("NGO :", ngo);
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    // 4. Success Response (Use 200 OK)
    res.status(200).json({
      success: true,
      message: "NGO details fetched successfully", // Fixed message
      loc: ngo.center_point,
    });

  } catch (error) {
    console.error("Failed to fetch NGO details:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not fetch NGO details.", // Fixed message
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
      center_point: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
        },
      },
    });
    console.log(nearestNGO);
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
