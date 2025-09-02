import express from "express";
import UserLocation from "../models/userLocation.js";
import { v4 as uuidv4 } from "uuid"; // ✅ for generating unique IDs

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
  export default router;
