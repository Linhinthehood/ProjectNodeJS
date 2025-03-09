// controllers/authController.js

const User = require('../models/usersModels');

/**
 * GET /auth
 * Render trang đăng nhập / đăng ký
 */
exports.getAuthPage = (req, res) => {
  // Tên file view: auth.ejs
  res.render('auth');
};

/**
 * POST /register
 * Xử lý đăng ký
 */
exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Kiểm tra email đã tồn tại?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered.');
    }

    // Tạo user mới
    const newUser = new User({ name, email, password, phone });
    await newUser.save();

    // Ví dụ: chuyển hướng về trang auth
    return res.redirect('/auth');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

/**
 * POST /login
 * Xử lý đăng nhập
 */
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found.');
    }

    // So sánh password (demo, chưa có hashing)
    if (user.password !== password) {
      return res.status(400).send('Invalid password.');
    }

    // Nếu đúng => đăng nhập thành công
    // Tùy ý: tạo session, JWT, v.v.
    return res.send('Login success!');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};