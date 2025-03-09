// routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import các hàm từ controller
const {
  getAuthPage,
  postRegister,
  postLogin
} = require('../controllers/authControllers');

// GET /auth => render trang auth.ejs
router.get('/auth', getAuthPage);

// POST /register => xử lý đăng ký
router.post('/register', postRegister);

// POST /login => xử lý đăng nhập
router.post('/login', postLogin);

module.exports = router;