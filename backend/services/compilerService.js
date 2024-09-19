const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

let pythonCommand = null;

const checkEnvironment = async () => {
  const checks = [
    { cmd: 'node --version', name: 'Node.js' },
    { cmd: 'g++ --version', name: 'C++ Compiler' }
  ];

  // Check for Python and determine the correct command
  const pythonCommands = ['py', 'python', 'python3'];
  for (const cmd of pythonCommands) {
    try {
      const { stdout } = await execPromise(`${cmd} --version`);
      pythonCommand = cmd;
      console.log(`Python check: Found (using ${cmd}), version: ${stdout.trim()}`);
      
      // Test Python execution
      const testScript = 'print("Hello, World!")';
      const { stdout: testOutput } = await execPromise(`${cmd} -c "${testScript}"`);
      console.log(`Python test execution result: ${testOutput.trim()}`);
      
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
      const { stdout } = await execPromise(check.cmd);
      console.log(`${check.name} check: Found, version: ${stdout.trim()}`);
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

const compileAndRun = async (code, language, input) => {
  console.log(`Starting compilation and execution for ${language}`);
  console.log(`Python command being used: ${pythonCommand}`);

  const tempDir = path.join(__dirname, '../temp');
  await fs.mkdir(tempDir, { recursive: true });

  const fileName = `temp_${Date.now()}`;
  const filePath = path.join(tempDir, fileName);

  let command;
  let extension;
  switch(language) {
    case 'javascript':
      extension = 'js';
      command = `node ${filePath}.js`;
      break;
    case 'python':
      extension = 'py';
      if (input) {
        await fs.writeFile(`${filePath}_input.txt`, input);
        command = `${pythonCommand} ${filePath}.py < ${filePath}_input.txt`;
      } else {
        command = `${pythonCommand} ${filePath}.py`;
      }
      break;
    case 'cpp':
      extension = 'cpp';
      command = `g++ ${filePath}.cpp -o ${filePath} && ${filePath}`;
      break;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }

  try {
    await fs.writeFile(`${filePath}.${extension}`, code);
    console.log(`Code written to file: ${filePath}.${extension}`);

    console.log('Executing command:', command);
    const start = process.hrtime();
    const { stdout, stderr } = await execPromise(command, { timeout: 10000 });
    const executionTime = process.hrtime(start);

    console.log('Execution completed');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);

    return {
      output: stdout.trim(),
      error: stderr.trim(),
      executionTime: executionTime[0] * 1e9 + executionTime[1] // in nanoseconds
    };
  } catch (error) {
    console.error('Execution error:', error);
    let errorMessage = `Execution failed for ${language}:\n`;
    errorMessage += `Error: ${error.message}\n`;
    errorMessage += `Stdout: ${error.stdout || 'N/A'}\n`;
    errorMessage += `Stderr: ${error.stderr || 'N/A'}\n`;
    errorMessage += `Command: ${command}\n`;
    errorMessage += `File: ${filePath}.${extension}\n`;
    
    if (error.code === 'ETIMEDOUT') {
      errorMessage += 'Execution timed out. Please check for infinite loops or increase the timeout.';
    } else if (error.code === 'ENOENT') {
      errorMessage += `Command not found. Please ensure ${language} is installed and added to your PATH.`;
    }
    
    throw new Error(errorMessage);
  } finally {
    await cleanUp(tempDir, fileName);
  }
};

async function cleanUp(tempDir, fileName) {
  try {
    const files = await fs.readdir(tempDir);
    await Promise.all(files
      .filter(file => file.startsWith(fileName))
      .map(file => fs.unlink(path.join(tempDir, file)))
    );
    console.log(`Cleaned up temporary files for ${fileName}`);
  } catch (err) {
    console.error('Error cleaning up files:', err);
  }
}

module.exports = { compileAndRun, checkEnvironment };