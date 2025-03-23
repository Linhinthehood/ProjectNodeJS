const User = require('../models/userModel');

exports.getProfile = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth');
    }
    const user = await User.findById(req.session.user.id);
    res.render('profile', { user });
};
