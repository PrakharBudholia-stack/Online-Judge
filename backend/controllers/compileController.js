const { compileAndRun, checkEnvironment } = require('../../services/compilerService');

let environmentCache = null;

exports.compileCode = async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  try {
    console.log('Compile request details:', { language, codeLength: code.length, inputLength: input?.length });

    if (!environmentCache) {
      await checkEnvironment();
      environmentCache = true;
    }

    console.log(`Starting compilation and execution for ${language}`);
    const result = await compileAndRun(code, language, input);

    if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
      console.log('Warning: Empty result from compileAndRun');
      return res.status(500).json({ error: 'Execution produced no output' });
    }

    console.log('Compilation successful. Result:', result);
    return res.json(result);
  } catch (error) {
    console.error('Error in compileCode:', error);
    return handleCompilationError(res, error);
  }
};

function handleCompilationError(res, error) {
  if (error.message.includes('Missing required software')) {
    return res.status(500).json({ error: 'Environment setup error', details: error.message });
  } else if (error.message.includes('Compilation failed')) {
    return res.status(400).json({ error: 'Compilation error', details: error.message });
  } else if (error.message.includes('Execution failed')) {
    return res.status(400).json({ error: 'Runtime error', details: error.message });
  } else if (error.message === 'Unsupported language') {
    return res.status(400).json({ error: 'Unsupported programming language' });
  } else if (error.message.includes('Failed to write code file')) {
    return res.status(500).json({ error: 'File system error', details: error.message });
  } else {
    return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
  }
}