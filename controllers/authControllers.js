// controllers/authController.js

const User = require('../models/userModel');
// const Product = require('../models/productModel');

/**
 * GET /auth
 * Render trang đăng nhập / đăng ký
 */
exports.getAuthPage = (req, res) => {
  // Tên file view: auth.ejs
  res.render('auth', { 
    loginError: null,
    signupError: null,
    formData: {} // To preserve form data on error
  });
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
      return res.render('auth', { 
        loginError: null,
        signupError: 'Email already registered.',
        formData: req.body // Preserve the form data
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.render('auth', {
        loginError: null,
        signupError: 'Password must be at least 6 characters long.',
        formData: req.body
      });
    }

    // Validate phone (if provided)
    if (phone) {
      const cleanPhone = phone.replace(/[- ]/g, '');
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return res.render('auth', {
          loginError: null,
          signupError: 'Phone number must be between 10 and 15 digits.',
          formData: req.body
        });
      }
    }

    // Tạo user mới
    const newUser = new User({ name, email, password, phone });
    await newUser.save();
    console.log("New user created:", newUser);

    // Lưu thông tin user vào session để tự động đăng nhập
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    };
    console.log("User logged in:", req.session.user);

    // Chuyển hướng về trang chủ
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.render('auth', { 
      loginError: null,
      signupError: 'Server error. Please try again later.',
      formData: req.body
    });
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
      return res.render('auth', { 
        loginError: 'User not found.',
        signupError: null,
        formData: req.body
      });
    }

    // So sánh password (demo, chưa có hashing)
    if (user.password !== password) {
      return res.render('auth', { 
        loginError: 'Invalid password.',
        signupError: null,
        formData: req.body
      });
    }

    // Nếu đúng => đăng nhập thành công
    // Lưu thông tin đăng nhập vào session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };
    console.log("User logged in:", req.session.user);

    // Tùy ý: tạo session, JWT, v.v.
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.render('auth', { 
      loginError: 'Server error. Please try again later.',
      signupError: null,
      formData: req.body
    });
  }
};