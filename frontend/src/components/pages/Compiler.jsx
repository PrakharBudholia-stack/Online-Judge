// Compiler.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Compiler = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript'); // Default language
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' }
  ];

  const handleCompile = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/compile', {
        code,
        language
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('An error occurred during compilation.');
    }
    setLoading(false);
  };

  return (
    <div className="compiler-container">
      <h1>Online Compiler</h1>
      
      <div className="language-selector">
        <label htmlFor="language">Select Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <textarea
        rows="10"
        cols="50"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
      ></textarea>

      <button onClick={handleCompile} disabled={loading}>
        {loading ? 'Compiling...' : 'Run Code'}
      </button>

      {output && (
        <div className="output">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default Compiler;
