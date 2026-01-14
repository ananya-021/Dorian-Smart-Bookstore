const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { userId, book } = req.body;

  const user = await User.findById(userId);
  user.wishlist.push(book);
  await user.save();

  res.json(user.wishlist);
});

router.get("/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user.wishlist);
});

module.exports = router;
