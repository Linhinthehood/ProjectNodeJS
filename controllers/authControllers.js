// controllers/authController.js

const User = require('../models/userModel');
// const Product = require('../models/productModel');

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
    // let products = await Product.find();

    // Kiểm tra email đã tồn tại?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered.');
    }

    // Tạo user mới
    const newUser = new User({ name, email, password, phone });
    await newUser.save();
    console.log("New user created:", newUser);

    // Lưu thông tin user vào session để tự động đăng nhập
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    };
    console.log("User logged in:", req.session.user);

    // Chuyển hướng về trang chủ
    return res.redirect("/");
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
    // let products = await Product.find();

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
    // Lưu thông tin đăng nhập vào session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
      // Thêm các thông tin khác nếu cần
    };
    console.log("User logged in:", req.session.user);

    // Tùy ý: tạo session, JWT, v.v.
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};