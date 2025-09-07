import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },  // new
  trustedContacts: [{ type: String }],
  driverIdPhoto: { type: String }, // will hold Cloudinary URL
       // new array for contacts
});

const User = mongoose.model("User", UserSchema);
export default User;
