const express = require('express');
const router = express.Router();
const compileController = require('../controllers/compileController');

// Check if `compileController` and `compileCode` are correctly imported
if (!compileController || typeof compileController.compileCode !== 'function') {
  throw new Error('compileController or compileCode is not properly defined');
}

// Route to handle code compilation requests
router.post('/compile', compileController.compileCode);

module.exports = router;
