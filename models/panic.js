import mongoose from "mongoose";

const panicSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {        
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Panic = mongoose.model("Panic", panicSchema);
export default Panic;
