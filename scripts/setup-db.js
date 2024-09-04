const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../backend/models/User');
const Problem = require('../backend/models/Problem');
const Contest = require('../backend/models/Contest');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        // Add your database setup logic here

        // Example: Create an admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: 'password', // In a real-world scenario, hash the password before saving
        });

        return adminUser.save();
    })
    .then(() => {
        console.log('Database setup complete');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error setting up the database:', err);
        mongoose.disconnect();
    });
