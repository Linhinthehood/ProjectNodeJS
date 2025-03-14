const express = require("express");
const fetchData = require("../services/fetchData");

const router = express.Router();

router.get("/:collection", async (req, res) => {
  try {
    const collectionName = req.params.collection;
    const data = await fetchData(collectionName);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
  }
});

module.exports = router;
