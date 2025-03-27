const Receipt = require('../models/receiptModel');
const User = require('../models/userModel');

exports.getProfile = async (req, res) => {
  try {
    // Giả sử bạn đã lưu thông tin user sau đăng nhập ở req.session.user
    const user = req.session.user;
    if (!user) {
      // Nếu chưa đăng nhập, chuyển hướng
      return res.redirect('/auth');
    }

    // Truy vấn danh sách đơn hàng (receipt) theo email
    const receipts = await Receipt.find({ email: user.email }).sort({ createdAt: -1 });

    // Render trang profile kèm thông tin user và receipts
    res.render('profile', { user, receipts });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).send('Server error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;
    const userId = req.session.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    if (user.password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update user information
    user.name = name;
    user.email = email;
    user.phone = phone;
    
    // Update password if provided
    if (newPassword && newPassword.trim() !== '') {
      user.password = newPassword;
    }

    // Save the updated user
    await user.save();

    // Update session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    // Redirect back to profile page
    res.redirect('/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


