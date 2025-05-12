const express = require("express");
const router = express.Router();
const Photo = require("../db/photoModel");
const User = require("../db/userModel");

router.get("/:photoId", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId).populate("comments.user_id", "first last_name");
    if (!photo) {
      return res.status(404).send({ message: "Photo not found" });
    }

    res.send(photo.comments);
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/:photoId", async (req, res) => {
  const { user_id, comment } = req.body;

  if (!user_id || !comment) {
    return res.status(400).send({ error: "user_id and comment are required" });
  }

  try {
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) {
      return res.status(404).send({ message: "Photo not found" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const newComment = {
      comment,
      date_time: new Date(),
      user_id,
    };

    photo.comments.push(newComment);
    await photo.save();

    res.status(201).send(newComment);
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
