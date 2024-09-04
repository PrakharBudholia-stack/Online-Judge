const { exec } = require('child_process');
const path = require('path');

const sandboxDir = path.resolve(__dirname, 'sandbox-config.json');

// Function to start a container
const startContainer = (language, code, callback) => {
  const containerName = `sandbox_${language}_${Date.now()}`;
  const imageName = `sandbox_${language}`;
  const codePath = path.join(__dirname, `${language}.js`);

  // Write code to file
  const fs = require('fs');
  fs.writeFileSync(codePath, code);

  const command = `docker run --name ${containerName} -v ${codePath}:/code/${language}.js -w /code ${imageName} node ${language}.js`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting container: ${error}`);
      callback(error, null);
      return;
    }

    console.log(`Container output: ${stdout}`);
    callback(null, stdout);
  });
};

// Function to clean up a container
const cleanupContainer = (containerName) => {
  const command = `docker rm -f ${containerName}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error cleaning up container: ${error}`);
      return;
    }

    console.log(`Container cleaned up: ${stdout}`);
  });
};

module.exports = { startContainer, cleanupContainer };

