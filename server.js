const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // Import connectDB
const path = require('path');

// Load biến môi trường
dotenv.config();

// Kết nối tới MongoDB
// connectDB();

const app = express();

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

const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost/${PORT}`);
});
