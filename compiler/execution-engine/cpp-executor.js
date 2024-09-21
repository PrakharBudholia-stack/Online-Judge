const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const execute = (code, input) => {
  return new Promise((resolve, reject) => {
    const filename = path.join(__dirname, 'temp.cpp');
    const output = path.join(__dirname, 'output');

    fs.writeFileSync(filename, code);

    const compileProcess = spawn('g++', [filename, '-o', output]);

    compileProcess.on('close', (code) => {
      if (code !== 0) {
        fs.unlinkSync(filename);
        reject('Compilation failed');
        return;
      }

      const runProcess = spawn(output);

      let programOutput = '';
      let errorOutput = '';

      runProcess.stdout.on('data', (data) => {
        programOutput += data.toString();
      });

      runProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      runProcess.on('close', (code) => {
        fs.unlinkSync(filename);
        fs.unlinkSync(output);
        if (code !== 0) {
          reject(errorOutput || 'Execution failed');
        } else {
          resolve(programOutput);
        }
      });

      // Write input to stdin only if it's provided
      if (input) {
        runProcess.stdin.write(input);
      }
      runProcess.stdin.end();
    });
  });
};

module.exports = { execute };