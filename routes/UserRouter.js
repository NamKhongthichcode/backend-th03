const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// Lấy danh sách người dùng
router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);  // In lỗi ra console để dễ dàng debug
    res.status(500).send({ message: "Internal server error" });
  }
});

// Lấy thông tin người dùng theo ID
router.get("/:id", async (req, res) => {
  try {
    // Kiểm tra ID có hợp lệ không
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ message: "Invalid user ID format" });
    }

    // Tìm người dùng theo ID
    const user = await User.findById(req.params.id).select(
      "_id first_name last_name location description occupation"
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });  // Trả về 404 nếu không tìm thấy
    }

    // Trả về thông tin người dùng
    res.status(200).json(user);
  } catch (err) {
    console.error(err);  // In lỗi ra console để dễ dàng debug
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
