const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { validationResult } = require('express-validator');
const { compileAndRun } = require('../services/compilerService');

exports.createProblem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, inputFormat, outputFormat, constraints, sampleInput, sampleOutput, difficulty, tags } = req.body;
        const newProblem = new Problem({ title, description, inputFormat, outputFormat, constraints, sampleInput, sampleOutput, difficulty, tags });
        console.log('Attempting to save problem:', newProblem);
        await newProblem.save();
        console.log('Problem saved successfully:', newProblem);
        res.status(201).json({ message: 'Problem created successfully', problem: newProblem });
    } catch (error) {
        console.error('Error creating problem:', error);
        res.status(500).json({ error: 'Error creating problem', details: error.message });
    }
};
exports.getProblems = async (req, res) => {
    try {
        console.log('Fetching all problems');
        const problems = await Problem.find().select('-__v');
        console.log(`Found ${problems.length} problems`);
        res.json(problems);
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ error: 'Error fetching problems', details: error.message });
    }
};



exports.getProblemDetails = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).select('-__v');
        if (!problem) return res.status(404).json({ error: 'Problem not found' });
        res.json(problem);
    } catch (error) {
        console.error('Error fetching problem details:', error);
        res.status(500).json({ error: 'Error fetching problem details', details: error.message });
    }
};

exports.updateProblem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-__v');
        if (!updatedProblem) return res.status(404).json({ error: 'Problem not found' });
        res.json({ message: 'Problem updated successfully', problem: updatedProblem });
    } catch (error) {
        console.error('Error updating problem:', error);
        res.status(500).json({ error: 'Error updating problem', details: error.message });
    }
};

exports.deleteProblem = async (req, res) => {
    try {
        const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
        if (!deletedProblem) return res.status(404).json({ error: 'Problem not found' });
        res.json({ message: 'Problem deleted successfully' });
    } catch (error) {
        console.error('Error deleting problem:', error);
        res.status(500).json({ error: 'Error deleting problem', details: error.message });
    }
};

exports.submitSolution = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { code, language, input } = req.body;
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        const { output, executionTime } = compileAndRun(code, language, input);

        const newSubmission = new Submission({
            user: req.user.userId,
            problem: req.params.id,
            code,
            language,
            input,
            output,
            executionTime,
            status: 'accepted' // You might want to implement a more sophisticated check here
        });

        await newSubmission.save();

        res.status(201).json({ 
            message: 'Solution submitted and executed successfully', 
            submission: {
                id: newSubmission._id,
                status: newSubmission.status,
                output: newSubmission.output,
                executionTime: newSubmission.executionTime
            }
        });
    } catch (error) {
        console.error('Error submitting solution:', error);
        res.status(500).json({ error: 'Error submitting solution', details: error.message });
    }
};
exports.getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user.userId })
            .populate('problem', 'title')
            .select('-code -__v');
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Error fetching submissions', details: error.message });
    }
};

exports.getSubmissionDetails = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId)
            .populate('problem', 'title')
            .select('-__v');
        
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        if (submission.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(submission);
    } catch (error) {
        console.error('Error fetching submission details:', error);
        res.status(500).json({ error: 'Error fetching submission details', details: error.message });
    }
};