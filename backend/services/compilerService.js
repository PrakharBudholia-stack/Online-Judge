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

// const compileAndRun = async (code, language, input, testCases) => {
//   console.log(`Starting compilation and execution for ${language}`);
//   console.log(`Python command being used: ${pythonCommand}`);

//   const tempDir = path.join(__dirname, '../temp');
//   await fs.mkdir(tempDir, { recursive: true });

//   const fileName = `temp_${Date.now()}`;
//   const filePath = path.join(tempDir, fileName);

//   try {
//     await fs.writeFile(`${filePath}.py`, code);
//     console.log(`Code written to file: ${filePath}.py`);
//     console.log(`File contents:\n${code}`);

//     if (!testCases || testCases.length === 0) {
//       console.log('Executing command:', pythonCommand, [`${filePath}.py`]);
//       const result = await runCommand(pythonCommand, [`${filePath}.py`], input, 30000);
//       return {
//         output: result.stdout.trim(),
//         error: result.stderr.trim(),
//         executionTime: result.executionTime
//       };
//     } else {
//       const results = [];
//       for (let i = 0; i < testCases.length; i++) {
//         const testCase = testCases[i];
//         console.log(`Executing test case ${i + 1}:`, pythonCommand, [`${filePath}.py`]);
//         try {
//           const result = await runCommand(pythonCommand, [`${filePath}.py`], testCase.input, 30000);
//           results.push({
//             testCase: i + 1,
//             input: testCase.input,
//             expectedOutput: testCase.output,
//             actualOutput: result.stdout.trim(),
//             error: result.stderr.trim(),
//             executionTime: result.executionTime,
//             passed: result.stdout.trim() === testCase.output.trim()
//           });
//         } catch (error) {
//           console.error(`Error in test case ${i + 1}:`, error);
//           results.push({
//             testCase: i + 1,
//             input: testCase.input,
//             expectedOutput: testCase.output,
//             actualOutput: '',
//             error: error.message,
//             executionTime: 0,
//             passed: false
//           });
//         }
//       }
//       return results;
//     }
//   } catch (error) {
//     console.error('Execution error:', error);
//     throw new Error(`Execution failed for ${language}: ${error.message}`);
//   } finally {
//     await cleanUp(tempDir, fileName);
//   }
// };
// Around line 120, replace the entire runCommand function with:
const runCommand = (command, args, input = '', timeout = 30000) => {
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
// Around line 160, replace the entire cleanUp function with:
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