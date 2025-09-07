import express from "express";
import UserLocation from "../models/userLocation.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Save panic location (POST)
router.post("/panic", async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    if (!userId || latitude == null || longitude == null) {
      return res.status(400).json({ error: "userId, latitude, and longitude are required" });
    }

    // Generate unique alertId
    const alertId = uuidv4();

    const location = new UserLocation({ alertId, userId, latitude, longitude });
    await location.save();

    res.status(201).json({ message: "Location saved", data: location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Fetch all panic locations (GET)
router.get("/panic", async (req, res) => {
  try {
    const locations = await UserLocation.find().sort({ updatedAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Optional health check
router.get("/test", (req, res) => {
  res.json({ message: "✅ Panic routes are working" });
});

export default router;
