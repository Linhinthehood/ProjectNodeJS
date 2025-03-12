const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Lưu đường dẫn ảnh
});

module.exports = mongoose.model("Product", ProductSchema);
