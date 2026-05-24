import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    pass: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    hasLoggedIn: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);