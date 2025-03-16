const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // Import connectDB
const path = require('path');
const session = require('express-session');

const app = express();

// Cấu hình session middleware (MemoryStore)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // Session sống 1 ngày
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

const shirts_page = require('./routes/shirtsRoutes');
app.use('/', shirts_page);

const bottoms_page = require('./routes/bottomsRoutes');
app.use('/', bottoms_page);

const outerwears_page = require('./routes/outerwearRoutes');
app.use('/', outerwears_page);

const accessories_page = require('./routes/accessoriesRoutes');
app.use('/', accessories_page);

const aboutus_page = require('./routes/aboutusRouters');
app.use('/', aboutus_page);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
