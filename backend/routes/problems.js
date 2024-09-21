const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const authMiddleware = require('../middleware/authMiddleware');

// Get all problems (with limited information)
router.get('/', async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    let query = {};
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    const problems = await Problem.find(query, 'title difficulty tags category acceptedSubmissions totalSubmissions');
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'An error occurred while fetching problems' });
  }
});

// Get a specific problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    // Exclude actual test cases from the response
    const { title, description, inputFormat, outputFormat, constraints, sampleInput, sampleOutput, difficulty, tags, category, acceptedSubmissions, totalSubmissions } = problem;
    res.json({ title, description, inputFormat, outputFormat, constraints, sampleInput, sampleOutput, difficulty, tags, category, acceptedSubmissions, totalSubmissions });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'An error occurred while fetching the problem' });
  }
});

// Create a new problem (protected route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(400).json({ error: 'An error occurred while creating the problem' });
  }
});

// Update a problem (protected route)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProblem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(updatedProblem);
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(400).json({ error: 'An error occurred while updating the problem' });
  }
});

// Delete a problem (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
    if (!deletedProblem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ error: 'An error occurred while deleting the problem' });
  }
});

module.exports = router;