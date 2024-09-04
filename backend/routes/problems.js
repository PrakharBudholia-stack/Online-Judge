const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const { authenticate } = require('../middleware/authMiddleware');

// Get all problems
router.get('/', problemController.getAllProblems);

// Get a specific problem by ID
router.get('/:id', problemController.getProblemById);

// Create a new problem (requires authentication)
router.post('/', authenticate, problemController.createProblem);

// Update a problem by ID (requires authentication)
router.put('/:id', authenticate, problemController.updateProblem);

// Delete a problem by ID (requires authentication)
router.delete('/:id', authenticate, problemController.deleteProblem);

module.exports = router;
