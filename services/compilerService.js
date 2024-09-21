const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

let pythonCommand = null;

const checkEnvironment = async () => {
  const checks = [
    { cmd: 'node', args: ['--version'], name: 'Node.js' },
    { cmd: 'g++', args: ['--version'], name: 'C++ Compiler' }
  ];

  const pythonCommands = ['py', 'python', 'python3'];
  for (const cmd of pythonCommands) {
    try {
      const result = await runCommand(cmd, ['--version']);
      pythonCommand = cmd;
      console.log(`Python check: Found (using ${cmd}), version: ${result.stdout.trim()}`);
      break;
    } catch (error) {
      console.log(`Python check failed for ${cmd}: ${error.message}`);
    }
  }

  if (!pythonCommand) {
    throw new Error('Python not found. Please ensure Python is installed and added to your PATH.');
  }

  const results = await Promise.all(checks.map(async check => {
    try {
      const result = await runCommand(check.cmd, check.args);
      console.log(`${check.name} check: Found, version: ${result.stdout.trim()}`);
      return { name: check.name, found: true };
    } catch (error) {
      console.log(`${check.name} check: Not found, error: ${error.message}`);
      return { name: check.name, found: false };
    }
  }));

  const missing = results.filter(result => !result.found).map(result => result.name);
  if (missing.length > 0) {
    throw new Error(`Missing required software: ${missing.join(', ')}`);
  }
};

const compileAndRun = async (code, language, problem) => {
  console.log(`Starting compilation and execution for ${language}`);
  console.log(`Python command being used: ${pythonCommand}`);

  const tempDir = path.join(__dirname, '../temp');
  await fs.mkdir(tempDir, { recursive: true });

  const fileName = `temp_${Date.now()}`;
  const filePath = path.join(tempDir, fileName);

  try {
    await fs.writeFile(`${filePath}.py`, code);
    console.log(`Code written to file: ${filePath}.py`);

    const results = [];
    let passedCount = 0;
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];
      console.log(`Executing test case ${i + 1}:`, pythonCommand, [`${filePath}.py`]);
      try {
        const result = await runCommand(pythonCommand, [`${filePath}.py`], testCase.input, 5000); // 5 seconds timeout
        const passed = result.stdout.trim() === testCase.expectedOutput.trim();
        if (passed) passedCount++;
        results.push({
          testCase: i + 1,
          passed: passed,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: result.stdout.trim(),
          error: result.stderr.trim(),
          executionTime: result.executionTime
        });
      } catch (error) {
        console.error(`Error in test case ${i + 1}:`, error);
        results.push({
          testCase: i + 1,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: error.message,
          executionTime: 0
        });
      }
    }

    const allPassed = passedCount === problem.testCases.length;
    const verdict = allPassed ? 'Accepted' : 'Wrong Answer';

    return {
      verdict: verdict,
      passedTestCases: passedCount,
      totalTestCases: problem.testCases.length,
      results: results
    };
  } catch (error) {
    console.error('Execution error:', error);
    throw new Error(`Execution failed for ${language}: ${error.message}`);
  } finally {
    await cleanUp(tempDir, fileName);
  }
};


const runCommand = (command, args, input = '', timeout = 5000) => {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command} ${args.join(' ')}`);
    console.log(`Input: ${input}`);
    console.log(`Timeout: ${timeout}ms`);

    const child = spawn(command, args);
    let stdout = '';
    let stderr = '';
    const startTime = process.hrtime();

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(`STDOUT: ${data.toString()}`);
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(`STDERR: ${data.toString()}`);
    });

    child.on('error', (error) => {
      console.error(`Process error: ${error.message}`);
      reject(error);
    });

    child.on('close', (code) => {
      const endTime = process.hrtime(startTime);
      const executionTime = endTime[0] * 1e9 + endTime[1]; // in nanoseconds

      console.log(`Process exited with code ${code}`);
      console.log(`Total STDOUT: ${stdout}`);
      console.log(`Total STDERR: ${stderr}`);

      if (code === 0) {
        resolve({ stdout, stderr, executionTime });
      } else {
        reject(new Error(`Process exited with code ${code}\nStdout: ${stdout}\nStderr: ${stderr}`));
      }
    });

    if (input) {
      console.log(`Writing input: ${input}`);
      child.stdin.write(input);
      child.stdin.end();
    } else {
      child.stdin.end();
    }

    const timer = setTimeout(() => {
      console.log('Execution timed out, killing process');
      child.kill('SIGTERM');
    }, timeout);

    child.on('exit', () => {
      clearTimeout(timer);
    });
  });
};

async function cleanUp(tempDir, fileName) {
  try {
    const files = await fs.readdir(tempDir);
    console.log(`Files in temp directory: ${files.join(', ')}`);
    await Promise.all(files
      .filter(file => file.startsWith(fileName))
      .map(file => {
        console.log(`Deleting file: ${file}`);
        return fs.unlink(path.join(tempDir, file));
      })
    );
    console.log(`Cleaned up temporary files for ${fileName}`);
  } catch (err) {
    console.error('Error cleaning up files:', err);
  }
}

module.exports = { compileAndRun, checkEnvironment };