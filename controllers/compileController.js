const Question = require('../models/Question');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Submission = require('../models/Submission');
const { compileCode } = require('./compileController');

exports.compileCode = async (req, res) => {
  const { questionId, code, language, customInput } = req.body;
  const userId = req.user.userId;

  console.log('Compile request received:', { questionId, userId, language });

  try {
    const question = await Question.findById(questionId).populate('hiddenTestCasesId');
    if (!question) {
      console.log('Question not found:', questionId);
      return res.status(404).send('Question not found');
    }

    let testCases = [];
    if (customInput) {
      testCases = [{ input: customInput, expectedOutput: '' }];
    } else {
      testCases = [...question.sampleTestCases, ...question.hiddenTestCasesId.testCases];
    }

    const results = [];
    let allPassed = true;

    const uniqueId = uuidv4();
    const userDir = path.join(__dirname, 'temp', uniqueId);
    fs.mkdirSync(userDir, { recursive: true });

    const fileName = `Solution.${getFileExtension(language)}`;
    const filePath = path.join(userDir, fileName);
    fs.writeFileSync(filePath, code);

    for (const testCase of testCases) {
      const { input, expectedOutput } = testCase;
      try {
        const actualOutput = await runCode(filePath, language, input);
        const passed = customInput ? true : actualOutput.trim() === expectedOutput.trim();
        results.push({ input, expectedOutput, actualOutput, passed });
        if (!passed) allPassed = false;
      } catch (error) {
        results.push({ input, expectedOutput, actualOutput: error.message, passed: false });
        allPassed = false;
      }
    }

    fs.rmSync(userDir, { recursive: true, force: true });

    res.status(200).json({ results, status: allPassed ? 'All tests passed' : 'Some tests failed' });
  } catch (error) {
    console.error('Error during code compilation:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

const runCode = (filePath, language, input) => {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const cmd = spawn(getCommand(language, filePath), { shell: true });

    cmd.stdin.write(input);
    cmd.stdin.end();

    cmd.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    cmd.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    cmd.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr));
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

const getFileExtension = (language) => {
  switch (language) {
    case 'javascript': return 'js';
    case 'python': return 'py';
    case 'java': return 'java';
    case 'cpp': return 'cpp';
    default: return '';
  }
};

const getCommand = (language, filePath) => {
  switch (language) {
    case 'javascript': return `node ${filePath}`;
    case 'python': return `python3 ${filePath}`;
    case 'java': return `javac ${filePath} && java ${filePath.replace('.java', '')}`;
    case 'cpp': return `g++ ${filePath} -o ${filePath}.out && ${filePath}.out`;
    default: return '';
  }
};

exports.submitSolution = async (req, res) => {
  const { userId, questionId, code, status } = req.body;

  try {
    // Create a new submission with the code, status, and createdAt
    const submission = new Submission({
      userId,
      questionId,
      code,
      status,
      createdAt: new Date() // Explicitly set the createdAt field
    });

    await submission.save();

    // Return the submission and status
    res.status(201).json({ message: 'Submission successful', submission });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ message: 'Error submitting solution', error });
  }
};