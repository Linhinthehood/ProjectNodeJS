const Product = require("../models/productModel");

// exports.getAllProducts = async (req,res) => {
//   try {
//     const products = await Product.find();
//     res.render("index", {products});
//   } catch (error) {
//     res.status(500).json({message : "Server error"})
//   }
// }

exports.getAllProducts = async (req, res) => {
  try {
    console.log("Attempting to fetch products...");
    const products = await Product.find();
    console.log("Products fetched:", products.length);
    
    if (products.length === 0) {
      console.log("No products found in database");
    }
    
    res.render("index", { products });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};