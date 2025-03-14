const express = require('express');
const router = express.Router();

router.get('/top_page', (req, res) => {
    res.render('top'); // top.ejs nằm trong thư mục 'views'
});

module.exports = router;

