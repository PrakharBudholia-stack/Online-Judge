const express = require('express');
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');

const router = express.Router();

router.post('/signup', validateSignup, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);

module.exports = router;