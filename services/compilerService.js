// services/compilerService.js
const { exec } = require('child_process');

exports.compile = (code, input, language) => {
  return new Promise((resolve, reject) => {
    // This is a simplified example. You should use a proper sandboxed environment for running untrusted code.
    const command = getCompileCommand(code, input, language);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
};

const getCompileCommand = (code, input, language) => {
  // Generate the appropriate command based on the language
  switch (language) {
    case 'javascript':
      return `node -e "${code}" <<< "${input}"`;
    case 'python':
      return `python -c "${code}" <<< "${input}"`;
    case 'cpp':
      return `echo "${code}" | g++ -o temp && ./temp <<< "${input}"`;
    default:
      throw new Error('Unsupported language');
  }
};