const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to display all products (Main Page)
router.get("/", productController.getAllProducts);


router.get("/product/:id", productController.getProductByID)

router.get("/shirts", productController.getShirts);

router.get("/bottoms", productController.getBottoms);

router.get("/accessoriesRouters",productController.getAccessories)

router.get("/outerwearRouters",productController.getOuterwears)


router.get("/search", productController.searchProducts);


router.get('/cart', productController.getCart);

module.exports = router;