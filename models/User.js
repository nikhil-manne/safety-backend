import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true }, // removed unique:true
  password: { type: String, required: true },
  mobile: { type: String, required: true, unique: true }, // enforce unique mobile instead
  trustedContacts: [{ type: String }],
});

const User = mongoose.model("User", UserSchema);
export default User;



