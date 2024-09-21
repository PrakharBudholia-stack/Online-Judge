const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    console.log('Auth headers:', req.headers);
    // Get token from headers
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        console.log('No token provided in the request');
        return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
        console.log('Attempting to verify token');
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully. Decoded payload:', decoded);

        // Find the user in the database
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            console.log('User not found or token not valid');
            throw new Error('User not found');
        }

        // Attach user and token to request object
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in authentication:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token', details: error.message });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired', details: error.message });
        } else {
            return res.status(401).json({ message: 'Authentication failed', details: error.message });
        }
    }
};

module.exports = authMiddleware;