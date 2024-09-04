const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const execute = (code) => {
    return new Promise((resolve, reject) => {
        const filename = path.join(__dirname, 'temp.js');
        fs.writeFileSync(filename, code);

        exec(`node ${filename}`, (error, stdout, stderr) => {
            fs.unlinkSync(filename); // Clean up temp file
            if (error) {
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
};

module.exports = { execute };
