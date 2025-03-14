const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to display all products (Main Page)
router.get("/", productController.getAllProducts);

router.get("/product/:id", productController.getProductByID)

module.exports = router;