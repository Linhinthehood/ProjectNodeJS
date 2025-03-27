const Receipt = require('../models/receiptModel');

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


