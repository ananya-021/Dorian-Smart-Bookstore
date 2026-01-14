const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  password: String,
  wishlist: { type: Array, default: [] },
  cart: { type: Array, default: [] }
});

module.exports = mongoose.model("User", UserSchema);
