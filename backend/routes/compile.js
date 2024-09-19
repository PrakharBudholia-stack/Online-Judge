const express = require('express');
const router = express.Router();
const compileController = require('../controllers/compileController');
const authMiddleware = require('../middleware/authMiddleware');

// Check if `compileController.compileCode` is correctly imported
if (typeof compileController.compileCode !== 'function') {
  throw new Error('compileController.compileCode is not properly defined');
}

// Route to handle code compilation requests
router.post('/', authMiddleware, async (req, res) => {
  const { language, code, input } = req.body;
  
  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  try {
    console.log('Received compile request:', { language, codeLength: code.length, input });
    console.log(`Compiling ${language} code...`);
    
    const result = await compileController.compileCode(req, res);
    
    if (!result) {
      console.log('Warning: Empty result from compileCode');
      return res.status(500).json({ error: 'Execution produced no output' });
    }
    
    // If the controller hasn't sent a response, send one here
    if (!res.headersSent) {
      res.json(result);
    }
  } catch (error) {
    console.error('Error in compile endpoint:', error);
    
    if (error.message.includes('Missing required software')) {
      res.status(500).json({ error: 'Environment setup error', details: error.message });
    } else if (error.message.includes('Compilation failed')) {
      res.status(400).json({ error: 'Compilation error', details: error.message });
    } else if (error.message.includes('Execution failed')) {
      res.status(400).json({ error: 'Runtime error', details: error.message });
    } else if (error.message === 'Unsupported language') {
      res.status(400).json({ error: 'Unsupported programming language' });
    } else if (error.message.includes('Failed to write code file')) {
      res.status(500).json({ error: 'File system error', details: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  }
});

module.exports = router;