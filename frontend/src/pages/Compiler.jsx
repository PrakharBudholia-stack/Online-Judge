// src/pages/Compiler.jsx
import React, { useState } from 'react';
import API from '../utils/api';

function Compiler() {
  const [language, setLanguage] = useState('javascript'); // default language
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/compile/run', {
        language,
        code,
      });

      setOutput(response.data.output);
    } catch (err) {
      setOutput('Error compiling code');
    }
  };

  return (
    <div>
      <h2>Online Compiler</h2>
      <form onSubmit={handleSubmit}>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here"
        />
        <button type="submit">Run Code</button>
      </form>
      <h3>Output:</h3>
      <pre>{output}</pre>
    </div>
  );
}

export default Compiler;
cd 