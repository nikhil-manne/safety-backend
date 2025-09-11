import express from "express";
import User from "../models/User.js";

const router = express.Router();

// ----------------- Signup -----------------
router.post("/signup", async (req, res) => {
  try {
    const { username, password, mobile, trustedContacts } = req.body;

    if (!username || !password || !mobile) {
      return res
        .status(400)
        .json({ error: "Username, password and mobile required" });
    }

    // Ensure mobile is unique
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res
        .status(400)
        .json({ error: "Mobile number already registered" });
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

// ----------------- Login -----------------
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ error: "Mobile and password required" });
    }

    const user = await User.findOne({ mobile, password });
    if (!user) {
      return res.status(400).json({ error: "Invalid mobile or password" });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
      mobile: user.mobile,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Get all users -----------------
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Update user profile -----------------
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mobile, trustedContacts } = req.body;

    // ensure mobile is not already used by another user
    if (mobile) {
      const existingMobile = await User.findOne({ mobile, _id: { $ne: id } });
      if (existingMobile) {
        return res
          .status(400)
          .json({ error: "Mobile number already registered by another user" });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { mobile, trustedContacts },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      message: "Profile updated successfully",
      userId: user._id,
      username: user.username,
      mobile: user.mobile,
      trustedContacts: user.trustedContacts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
