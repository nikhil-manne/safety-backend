import express from "express";
import UserLocation from "../models/userLocation.js";
import Panic from "../models/panic.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Save panic location (POST) - expects { userId, latitude, longitude }
router.post("/panic", async (req, res) => {
  try {
    const { userId, latitude, longitude, type } = req.body;

    if (!userId || latitude == null || longitude == null) {
      return res.status(400).json({ error: "userId, latitude, and longitude are required" });
    }

    // Generate unique alertId
    const alertId = uuidv4();

    // Save to UserLocation collection (short-lived)
    const newLoc = await UserLocation.create({
      alertId,
      userId,
      latitude,
      longitude,
      updatedAt: new Date(),
    });

    // Try to get username from User collection (if exists)
    let username = null;
    try {
      const user = await User.findById(userId).select("username");
      if (user) username = user.username;
    } catch (e) {
      // ignore - user lookup failed
    }

    // Save to Panic collection (with TTL index set in model)
    const newPanic = await Panic.create({
      userId,
      username: username || undefined,
      location: { lat: latitude, lng: longitude }
    });

    // Log to console for admin/debugging
    console.log("[PANIC RECEIVED]", { alertId, userId, username, latitude, longitude, type, createdAt: new Date().toISOString() });

    return res.status(201).json({ message: "Panic received", alertId, data: { newLoc, newPanic } });
  } catch (err) {
    console.error("Error in /panic:", err);
    return res.status(500).json({ error: "Server error saving panic" });
  }
});

// Get recent user locations (for admin/testing)
router.get("/locations", async (req, res) => {
  try {
    const locations = await UserLocation.find().sort({ updatedAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/panic - show all panic alerts (latest first)
router.get("/", async (req, res) => {
  try {
    const panics = await Panic.find().sort({ createdAt: -1 });
    res.status(200).json(panics);
  } catch (error) {
    console.error("Error fetching panic alerts:", error);
    res.status(500).json({ message: "Error fetching panic alerts", error: error.message });
  }
});

// Optional health check
router.get("/test", (req, res) => {
  res.json({ message: "✅ Panic routes are working" });
});

export default router;


