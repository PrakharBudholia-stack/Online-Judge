const executeCode = (language, code, input, timeout = 10000) => {
    return new Promise((resolve, reject) => {
      let executor;
      switch (language) {
        case 'javascript':
          executor = require('./js-executor');
          break;
        case 'python':
          executor = require('./py-executor');
          break;
        case 'cpp':
          executor = require('./cpp-executor');
          break;
        default:
          return reject(new Error('Unsupported language'));
      }
  
      const timeoutId = setTimeout(() => {
        reject(new Error('Execution timed out'));
      }, timeout);
  
      executor.execute(code, input)
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  };
  
  module.exports = { executeCode };