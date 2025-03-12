const express = require('express');
const router = express.Router();

router.get('/main', (req, res) => {
    res.render('main'); // main.ejs nằm trong thư mục 'views'
});

module.exports = router;

