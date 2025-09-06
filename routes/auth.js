import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password, mobile, trustedContacts } = req.body;

    if (!username || !password || !mobile) {
      return res.status(400).json({ error: "Username, password and mobile required" });
    }

    // Check if user exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = new User({
      username,
      password,
      mobile,
      trustedContacts: trustedContacts || [],
    });
    await user.save();

    res.status(201).json({
      message: "Signup successful",
      userId: user._id,
      username: user.username,
      mobile: user.mobile,
      trustedContacts: user.trustedContacts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

