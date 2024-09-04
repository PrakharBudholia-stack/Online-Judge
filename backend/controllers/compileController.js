const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const EXECUTORS = {
  javascript: path.join(__dirname, '../../compiler/execution-engine/js-executor.js'),
  python: path.join(__dirname, '../../compiler/execution-engine/py-executor.js'),
  cpp: path.join(__dirname, '../../compiler/execution-engine/cpp-executor.js')
};

exports.compileCode = (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  const executor = EXECUTORS[language];
  if (!executor) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const codeFilePath = path.join(__dirname, '../../compiler/temp/code-file');
  fs.writeFileSync(codeFilePath, code);

  const command = language === 'cpp' 
    ? `g++ -o ${codeFilePath}.out ${codeFilePath} && ${codeFilePath}.out` 
    : `node ${executor} ${codeFilePath}`;

  exec(command, (error, stdout, stderr) => {
    fs.unlinkSync(codeFilePath);

    if (error) {
      return res.status(500).json({ error: stderr });
    }

    res.json({ output: stdout });
  });
};
