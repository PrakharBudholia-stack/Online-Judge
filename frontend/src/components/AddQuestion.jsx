import React, { useState } from 'react';
import axiosInstance from '../auth/axiosInstance';
import './AddQuestion.css'; // Ensure you have a CSS file for styling

function AddQuestion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [sampleTestCases, setSampleTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [hiddenTestCases, setHiddenTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAddSampleTestCase = () => {
    setSampleTestCases([...sampleTestCases, { input: '', expectedOutput: '' }]);
  };

  const handleAddHiddenTestCase = () => {
    setHiddenTestCases([...hiddenTestCases, { input: '', expectedOutput: '' }]);
  };

  const handleSampleTestCaseChange = (index, field, value) => {
    const newSampleTestCases = [...sampleTestCases];
    newSampleTestCases[index][field] = value;
    setSampleTestCases(newSampleTestCases);
  };

  const handleHiddenTestCaseChange = (index, field, value) => {
    const newHiddenTestCases = [...hiddenTestCases];
    newHiddenTestCases[index][field] = value;
    setHiddenTestCases(newHiddenTestCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/questions', {
        title,
        description,
        difficulty,
        sampleTestCases,
        hiddenTestCases,
      });
      setSuccess('Question added successfully!');
      setError(null);
    } catch (error) {
      setError('Error adding question');
      setSuccess(null);
    }
  };

  return (
    <div className="add-question-container">
      <h1 className="heading">Add Question</h1>
      <form onSubmit={handleSubmit} className="add-question-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <h2>Sample Test Cases</h2>
        {sampleTestCases.map((testCase, index) => (
          <div key={index} className="test-case">
            <input
              type="text"
              placeholder="Input"
              value={testCase.input}
              onChange={(e) => handleSampleTestCaseChange(index, 'input', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Expected Output"
              value={testCase.expectedOutput}
              onChange={(e) => handleSampleTestCaseChange(index, 'expectedOutput', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddSampleTestCase} className="add-test-case-button">
          Add Sample Test Case
        </button>
        <h2>Hidden Test Cases</h2>
        {hiddenTestCases.map((testCase, index) => (
          <div key={index} className="test-case">
            <input
              type="text"
              placeholder="Input"
              value={testCase.input}
              onChange={(e) => handleHiddenTestCaseChange(index, 'input', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Expected Output"
              value={testCase.expectedOutput}
              onChange={(e) => handleHiddenTestCaseChange(index, 'expectedOutput', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddHiddenTestCase} className="add-test-case-button">
          Add Hidden Test Case
        </button>
        <button type="submit" className="submit-button">Submit</button>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
}

export default AddQuestion;