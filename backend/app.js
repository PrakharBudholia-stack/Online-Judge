const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000; // Remove PORT initialization from here

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const compileRoutes = require('./routes/compile');
const contestRoutes = require('./routes/contests');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/compile', compileRoutes);
app.use('/api/contests', contestRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Online Compiler API');
});

module.exports = app;
