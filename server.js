const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // Import connectDB
const path = require('path');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));

// Load biến môi trường
dotenv.config();

// Kết nối tới MongoDB
connectDB();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/', productRoutes);

const top_page = require('./routes/top_page');
app.use('/', top_page);

app.get('/cart', (req, res) => {
  if (!req.session.cart) {
    req.session.cart = []; // Initialize cart if undefined
  }
  res.render('cart', { cart: req.session.cart });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
