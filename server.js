const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

// Load env variables first
dotenv.config();

// Import connectDB after loading environment variables
const connectDB = require('./config/db');  

const app = express();

// Conditionally set up Redis
let redisClient;
let sessionConfig = {
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // Session lives for 1 day
        secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
    }
};

// Only use Redis if REDIS_HOST is set AND not in local development mode
const isDocker = process.env.IS_DOCKER === 'true';
if (process.env.REDIS_HOST && isDocker) {
    console.log('Setting up Redis store for sessions');
    const RedisStore = require('connect-redis').default;
    const Redis = require('ioredis');
    
    // Initialize Redis client with retry strategy
    redisClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
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
    
    // Add Redis store to session config
    sessionConfig.store = new RedisStore({ 
        client: redisClient,
        prefix: 'session:'
    });
} else {
    console.log('Using memory store for sessions (development mode)');
}

// Configure session middleware
app.use(session(sessionConfig));

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

// Debug environment variables
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

const PORT = process.env.PORT || 8080;
console.log('Using port:', PORT);
app.listen(PORT, () => {
    console.log(`Server instance ${process.env.INSTANCE_ID || 'dev'} is running on port http://localhost:${PORT}`);
});
