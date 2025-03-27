const Receipt = require('../models/receiptModel');
const User = require('../models/userModel');

exports.getProfile = async (req, res, next) => {
  try {
    const user = req.session.user;
    // Truy vấn danh sách đơn hàng (receipt) theo email
    const receipts = await Receipt.find({ email: user.email }).sort({ createdAt: -1 });
    // Render trang profile kèm thông tin user và receipts
    res.render('profile', { user, receipts });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;
    const userId = req.session.user.id;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Password verification is still here as it's part of business logic
    if (user.password !== currentPassword) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 400;
      throw error;
    }

    // Update user information
    user.name = name;
    user.email = email;
    user.phone = phone;
    
    // Update password if provided
    if (newPassword && newPassword.trim() !== '') {
      user.password = newPassword;
    }

    await user.save();

    // Update session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
};


