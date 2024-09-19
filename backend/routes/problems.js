const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const authenticate = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Problem routes
router.get('/', problemController.getProblems);
router.get('/:id', problemController.getProblemDetails);
router.post('/', authenticate, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('inputFormat').notEmpty().withMessage('Input format is required'),
    body('outputFormat').notEmpty().withMessage('Output format is required'),
    body('constraints').notEmpty().withMessage('Constraints are required'),
    body('sampleInput').notEmpty().withMessage('Sample input is required'),
    body('sampleOutput').notEmpty().withMessage('Sample output is required'),
    body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
    body('tags').isArray().withMessage('Tags must be an array')
], problemController.createProblem);
router.put('/:id', authenticate, [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('inputFormat').optional().notEmpty().withMessage('Input format cannot be empty'),
    body('outputFormat').optional().notEmpty().withMessage('Output format cannot be empty'),
    body('constraints').optional().notEmpty().withMessage('Constraints cannot be empty'),
    body('sampleInput').optional().notEmpty().withMessage('Sample input cannot be empty'),
    body('sampleOutput').optional().notEmpty().withMessage('Sample output cannot be empty'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
    body('tags').optional().isArray().withMessage('Tags must be an array')
], problemController.updateProblem);


// Submission routes
router.post('/:id/submit', authenticate, [
    body('code').notEmpty().withMessage('Code is required'),
    body('language').isIn(['javascript', 'python', 'cpp']).withMessage('Invalid language'),
    body('input').optional()
], problemController.submitSolution);
router.get('/submissions', authenticate, problemController.getSubmissions);
router.get('/submissions/:submissionId', authenticate, problemController.getSubmissionDetails);

module.exports = router;