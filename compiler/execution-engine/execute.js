const { exec } = require('child_process');
const path = require('path');

const executeCode = (language, code) => {
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

        executor.execute(code)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
};

module.exports = { executeCode };
