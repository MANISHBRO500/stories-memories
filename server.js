require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

/* Schema */
const storySchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  likes: { type: Number, default: 0 },
  likedBy: [String],
  createdAt: { type: Date, default: Date.now }
});

const Story = mongoose.model("Story", storySchema);

/* Publish story */
app.post("/publish", async (req, res) => {
  await Story.create(req.body);
  res.json({ success: true });
});

/* Get stories (MOST LIKED FIRST) */
app.get("/stories", async (req, res) => {
  const stories = await Story.find().sort({ likes: -1 });
  res.json(stories);
});

/* Like story */
app.post("/like/:id", async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) return res.sendStatus(404);

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  if (story.likedBy.includes(ip)) {
    return res.json({ liked: false });
  }

  story.likes++;
  story.likedBy.push(ip);
  await story.save();

  res.json({ liked: true, likes: story.likes });
});

/* Delete story (admin site uses this) */
app.delete("/delete/:id", async (req, res) => {
  await Story.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
