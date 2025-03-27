const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // Import connectDB
const path = require('path');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');

const app = express();

// Initialize Redis client with retry strategy
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
    retryStrategy: function(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true
});

// Handle Redis connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redisClient.on('ready', () => {
    console.log('Redis client is ready');
});

// Configure session middleware with Redis store
app.use(session({
    store: new RedisStore({ 
        client: redisClient,
        prefix: 'session:'
    }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // Session lives for 1 day
        secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
    }
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

const profileRoutes = require('./routes/profileRoutes');
app.use('/', profileRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/', orderRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server instance ${process.env.INSTANCE_ID || 1} is running on port ${PORT}`);
});
