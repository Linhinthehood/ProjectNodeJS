const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  thumbnail: { type: String, required: true },
  images: [{ type: String }], 
  type: { type: String, enum: ["shirts", "bottoms", "accessories", "outerwears"], required: true }
});

// exports.Product = mongoose.model("Product", productSchema);
module.exports = mongoose.model("Product", productSchema);