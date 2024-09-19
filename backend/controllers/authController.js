const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        console.log('Attempting to register user:', email);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const newUser = new User({ username, email, password });
        await newUser.save();
        
        console.log('User registered successfully:', email);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        console.log('Login attempt for email:', email);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found in database for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        console.log('User found in database:', user.email);
        console.log('Stored hashed password:', user.password);
        console.log('Provided password:', password);

        let isMatch;
        try {
            isMatch = await user.comparePassword(password);
            console.log('Password comparison result:', isMatch);
        } catch (error) {
            console.error('Error during password comparison:', error);
            return res.status(500).json({ message: 'Error during authentication' });
        }

        if (!isMatch) {
            console.log('Password does not match for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        console.log('Login successful for user:', email);
        res.json({ token, userId: user._id, email: user.email });
    } catch (error) {
        console.error('Unexpected error during login:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.logout = (req, res) => {
    // Note: With JWT, logout is typically handled client-side
    // by removing the token from storage
    console.log('Logout request received');
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// You might want to add more controller methods here, such as:
// - updateProfile
// - changePassword
// - deleteAccount
// etc.