// routes/route.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// GET /route?origin=lat,lng&destination=address or lat,lng
router.get("/", async (req, res) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ error: "Origin and destination required" });
    }

    const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY; // keep in .env
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(
      destination
    )}&mode=driving&key=${GOOGLE_MAPS_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({ error: "No routes found" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
