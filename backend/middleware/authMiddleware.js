const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
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
        // Attach user ID to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Invalid token', details: error.message });
    }
};

module.exports = authMiddleware;