const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.get("/photosOfUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const photos = await Photo.find({ user_id: req.params.id }).lean();

    const commentUserIds = [];
    photos.forEach(photo => {
      photo.comments.forEach(comment => {
        if (!commentUserIds.includes(comment.user_id)) {
          commentUserIds.push(comment.user_id);
        }
      });
    });

    const commentUsers = await User.find({ '_id': { $in: commentUserIds } }).select("_id first_name last_name").lean();
    const commentUsersMap = commentUsers.reduce((map, user) => {
      map[user._id] = user;
      return map;
    }, {});

    for (let photo of photos) {
      for (let comment of photo.comments) {
        const userInfo = commentUsersMap[comment.user_id];
        if (userInfo) {
          comment.user = userInfo;
          delete comment.user_id; 
        }
      }
    }

    res.status(200).json(photos);
  } catch (err) {
    console.error(err);  
    res.status(500).send({ message: "Error fetching photos or user data" });
  }
});

module.exports = router;
