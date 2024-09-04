const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');

// Get all contests
router.get('/', contestController.getAllContests);

// Get a contest by ID
router.get('/:id', contestController.getContestById);

// Create a new contest
router.post('/', contestController.createContest);

// Update a contest
router.put('/:id', contestController.updateContest);

// Delete a contest
router.delete('/:id', contestController.deleteContest);

module.exports = router;
