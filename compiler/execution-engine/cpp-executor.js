const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const execute = (code) => {
    return new Promise((resolve, reject) => {
        const filename = path.join(__dirname, 'temp.cpp');
        const output = path.join(__dirname, 'output');

        fs.writeFileSync(filename, code);

        exec(`g++ ${filename} -o ${output} && ${output}`, (error, stdout, stderr) => {
            fs.unlinkSync(filename); // Clean up temp file
            fs.unlinkSync(output);   // Clean up compiled output
            if (error) {
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
};

module.exports = { execute };
