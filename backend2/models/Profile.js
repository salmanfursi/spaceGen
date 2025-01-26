const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  bio: { type: String },
  interests: { type: [String] },
});

module.exports = mongoose.model("Profile", profileSchema);