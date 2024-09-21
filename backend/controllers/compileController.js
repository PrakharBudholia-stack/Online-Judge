const { compileAndRun, checkEnvironment } = require('../../services/compilerService');
const Problem = require('../models/Problem');

let environmentCache = null;

const submitSolution = async (req, res) => {
  const { problemId, language, code } = req.body;

  console.log(req.body);
  if (!problemId || !language || !code) {
    return res.status(400).json({ error: 'Problem ID, language, and code are required' });
  }

  try {
    if (!environmentCache) {
      try {
        await checkEnvironment();
        environmentCache = true;
      } catch (envError) {
        console.error('Environment check failed:', envError);
        return res.status(500).json({ error: 'Environment setup error', details: envError.message });
      }
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    console.log(`Starting compilation and execution for problem ${problemId} in ${language}`);
    const result = await compileAndRun(code, language, problem);

    console.log('Execution completed. Result:', JSON.stringify(result, null, 2));
    return res.json(result);
  } catch (error) {
    console.error('Error in submitSolution:', error);
    return handleSubmissionError(res, error);
  }
};

module.exports = {compileAndRun, submitSolution, checkEnvironment};

function handleSubmissionError(res, error) {
  console.error('Handling submission error:', error);

  if (error.message.includes('Missing required software')) {
    return res.status(500).json({ error: 'Environment setup error', details: error.message });
  } else if (error.message.includes('Compilation failed')) {
    return res.status(400).json({ error: 'Compilation error', details: error.message });
  } else if (error.message.includes('Execution failed')) {
    return res.status(400).json({ error: 'Runtime error', details: error.message });
  } else if (error.message === 'Unsupported language') {
    return res.status(400).json({ error: 'Unsupported programming language' });
  } else if (error.message.includes('Failed to write code file')) {
    return res.status(500).json({ error: 'File system error', details: error.message });
  } else if (error.message.includes('Execution timed out')) {
    return res.status(408).json({ error: 'Time Limit Exceeded', details: 'The code took too long to execute.' });
  } else {
    return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
  }
}