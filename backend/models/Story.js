const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  likes: { type: Number, default: 0 },
  likedBy: [String],   // IP addresses
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Story", storySchema);
