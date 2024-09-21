const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const execute = (code, input) => {
  return new Promise((resolve, reject) => {
    const filename = path.join(__dirname, 'temp.js');
    fs.writeFileSync(filename, code);

    const nodeProcess = spawn('node', [filename]);

    let output = '';
    let errorOutput = '';

    nodeProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    nodeProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    nodeProcess.on('close', (code) => {
      fs.unlinkSync(filename); // Clean up temp file
      if (code !== 0) {
        reject(errorOutput || 'Execution failed');
      } else {
        resolve(output);
      }
    });

    // Write input to stdin only if it's provided
    if (input) {
      nodeProcess.stdin.write(input);
    }
    nodeProcess.stdin.end();
  });
};

module.exports = { execute };