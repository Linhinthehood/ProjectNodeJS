const Product = require("../models/productModel");

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

exports.getProductByID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    if (!Array.isArray(product.images)) {
      product.images = [product.images]; // Convert single image to array
    }
    res.render("detail", { product });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send("Server error");
  }
};