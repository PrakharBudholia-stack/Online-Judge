const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const execute = (code, input) => {
  return new Promise((resolve, reject) => {
    const filename = path.join(__dirname, 'temp.py');
    fs.writeFileSync(filename, code);

    const pythonProcess = spawn('python', [filename]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      fs.unlinkSync(filename); // Clean up temp file
      if (code !== 0) {
        reject(errorOutput || 'Execution failed');
      } else {
        resolve(output);
      }
    });

    // Write input to stdin only if it's provided
    if (input) {
      pythonProcess.stdin.write(input);
    }
    pythonProcess.stdin.end();
  });
};

module.exports = { execute };