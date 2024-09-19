const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/test-db', async (req, res) => {
  try {
    const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
    const testDoc = new TestModel({ name: 'test' });
    await testDoc.save();
    res.status(201).json({ message: 'Test document created', doc: testDoc });
  } catch (error) {
    console.error('Error in test route:', error);
    res.status(500).json({ error: 'Error in test route', details: error.message });
  }
});

module.exports = router;