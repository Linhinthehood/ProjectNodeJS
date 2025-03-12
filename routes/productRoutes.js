const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;
const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
});

// Cấu hình Multer
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => ({
    bucketName: "uploads",
    filename: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

// API Upload ảnh
router.post("/upload", upload.single("image"), async (req, res) => {
  res.json({ file: req.file });
});

// API Tạo sản phẩm
router.post("/add", async (req, res) => {
  const { name, price, image } = req.body;

  try {
    const newProduct = new Product({ name, price, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
