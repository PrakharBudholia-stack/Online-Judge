import React, { useState, useEffect } from 'react';
import axiosInstance from '../auth/axiosInstance';
import Editor from '@monaco-editor/react';
import './CodeEditor.css'; // Assuming you have a CSS file for styling

function CodeEditor({ questionId, initialLanguage }) {
  const [code, setCode] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(initialLanguage); // Initialize language state
  const [loading, setLoading] = useState(false); // Loading state for running tests
  const [status, setStatus] = useState(''); // Status message

  useEffect(() => {
    const fetchBoilerplateCode = () => {
      let boilerplate;
      switch (language) {
        case 'javascript':
          boilerplate = `function solution() {\n  // Write your code here\n  return 0;\n}`;
          break;
        case 'python':
          boilerplate = `def solution():\n  # Write your code here\n  return 0`;
          break;
        case 'java':
          boilerplate = `public class Solution {\n  public static void main(String[] args) {\n    // Write your code here\n  }\n}`;
          break;
        case 'cpp':
          boilerplate = `#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write your code here\n  return 0;\n}`;
          break;
        default:
          boilerplate = '';
      }
      setCode(boilerplate);
    };

    fetchBoilerplateCode();
  }, [language]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleRunTests = async () => {
    setLoading(true); // Set loading to true when starting the test execution
    try {
      const response = await axiosInstance.post('/api/compile', { questionId, code, language });
      setResults(response.data.results);
      setStatus(response.data.status); // Set status message
      setError(null);
    } catch (error) {
      console.error('Error compiling code:', error);
      setError('Code compilation failed');
    } finally {
      setLoading(false); // Set loading to false when test execution is complete
    }
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when starting the submission
    try {
      const passedCount = results.filter(result => result.passed).length;
      const submissionStatus = passedCount === results.length ? 'Accepted' : `${passedCount}/${results.length} Passed`;

      const response = await axiosInstance.post('/api/submit', { 
        userId: 'yourUserId', // Replace with actual user ID
        questionId, 
        code, 
        status: submissionStatus 
      });
      setStatus(response.data.status); // Set status message
      setError(null);

      // Show alert after successful submission
      alert('Submission successful!');
    } catch (error) {
      console.error('Error submitting solution:', error);
      setError('Solution submission failed');
    } finally {
      setLoading(false); // Set loading to false when submission is complete
    }
  };

  const passedCount = results.filter(result => result.passed).length;

  return (
    <div className="code-editor-container">
      <div className="language-selector">
        <label htmlFor="language">Language:</label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          {/* Add more languages as needed */}
        </select>
      </div>
      <Editor
        height="600px" // Increased height of the code editor
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
      <div className="button-container">
        <button className="run-tests-button" onClick={handleRunTests}>Run Tests</button>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
      {error && <div className="error">{error}</div>}
      <h3>Results {results.length > 0 && `(${passedCount}/${results.length} Passed)`}</h3>
      {!loading && results.length > 0 && (
        <div className="results">
          <div className="status">{status}</div> {/* Display status message */}
          {results.map((result, index) => (
            <div
              key={index}
              className={`result-box ${result.passed ? 'passed' : 'failed'}`}
            >
              <strong>Test Case {index + 1}:</strong> {result.passed ? 'Passed' : 'Failed'}
              {index < 2 && (
                <>
                  <br />
                  <strong>Input:</strong> {result.input} <br />
                  <strong>Expected Output:</strong> {result.expectedOutput} <br />
                  <strong>Actual Output:</strong> {result.actualOutput}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CodeEditor;