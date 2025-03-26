// controllers/orderController.js
const Receipt = require('../models/receiptModel');

exports.placeOrder = async (req, res) => {
  try {
    // Lấy dữ liệu từ body (truyền lên từ phía client)
    const {
      email,
      fullName,
      phone,
      address,
      district,
      city,
      shippingMethod,
      paymentMethod,
      cartItems,
      totalPrice
    } = req.body;

    // Tạo document Receipt
    const newReceipt = new Receipt({
      email,
      fullName,
      phone,
      address,
      district,
      city,
      shippingMethod,
      paymentMethod,
      cartItems,
      totalPrice
    });

    await newReceipt.save();

    // Sau khi lưu thành công, có thể trả về JSON, hoặc redirect
    return res.json({ success: true, message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
