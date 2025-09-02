import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  alertId: {   // <-- custom ID field
    type: String,
    required: true,
    unique: true
  },
  userId: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("UserLocation", userSchema);
