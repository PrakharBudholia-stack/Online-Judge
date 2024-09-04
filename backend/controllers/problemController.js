const Problem = require('../models/Problem');
const Submission = require('../models/Submission');

// Create a new problem
exports.createProblem = async (req, res) => {
    try {
        const { title, description, inputFormat, outputFormat, constraints, sampleInput, sampleOutput } = req.body;
        const newProblem = new Problem({ title, description, inputFormat, outputFormat, constraints, sampleInput, sampleOutput });
        await newProblem.save();
        res.status(201).json({ message: 'Problem created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating problem' });
    }
};

// Get all problems
exports.getProblems = async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching problems' });
    }
};

// Get problem details
exports.getProblemDetails = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ error: 'Problem not found' });
        res.json(problem);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching problem details' });
    }
};

// Submit solution to a problem
exports.submitSolution = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const newSubmission = new Submission({ problem: problemId, code, language, user: req.user.userId });
        await newSubmission.save();
        // Compile and execute the code, then save the result
        // (Here, you can integrate the compileController's compileAndRun function)
        res.status(201).json({ message: 'Solution submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting solution' });
    }
};
