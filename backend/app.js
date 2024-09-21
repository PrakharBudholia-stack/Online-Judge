const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const app = express();

// Load configuration based on environment
const config = process.env.NODE_ENV === 'production' 
  ? require('./config.prod')
  : require('./config.dev');

// Enhanced security with helmet
app.use(helmet());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Import routes
const authRoutes = require('./routes/auth');
const compileRoutes = require('./routes/compile');
const contestRoutes = require('./routes/contests');
const problemRoutes = require('./routes/problems');
const testRoute = require('./routes/test-route');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/compile', compileRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/test', testRoute);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Online Compiler API' });
});

// Log routes after they've been set up
console.log('Routes set up:');
app._router && app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.stack[0].method.toUpperCase() + ' ' + r.route.path)
  } else if (r.name === 'router') {
    r.handle.stack.forEach(function(nestedRoute){
      if (nestedRoute.route) {
        const method = nestedRoute.route.stack[0].method.toUpperCase();
        console.log(method + ' ' + r.regexp.source.replace("^\\", "/").replace("\\/?(?=\\/|$)", "") + nestedRoute.route.path);
      }
    })
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

module.exports = { app, config };