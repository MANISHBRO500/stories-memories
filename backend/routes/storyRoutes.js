const express = require("express");
const Story = require("../models/Story");
const router = express.Router();

/* Publish Story */
router.post("/publish", async (req, res) => {
  try {
    const story = new Story(req.body);
    await story.save();
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

/* Get All Stories */
router.get("/stories", async (req, res) => {
  const stories = await Story.find().sort({ createdAt: -1 });
  res.json(stories);
});

/* Like Story */
router.post("/like/:id", async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) return res.status(404).json({ message: "Not found" });

  const userIP =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  if (story.likedBy.includes(userIP)) {
    return res.json({ liked: false });
  }

  story.likes++;
  story.likedBy.push(userIP);
  await story.save();

  res.json({ liked: true, likes: story.likes });
});

module.exports = router;
