import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../auth/axiosInstance';
import './AddQuestion.css'; // Import the CSS file for styling

function AddQuestion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [sampleTestCases, setSampleTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [hiddenTestCases, setHiddenTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();

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

  const handleDeleteSampleTestCase = (index) => {
    const newSampleTestCases = sampleTestCases.filter((_, i) => i !== index);
    setSampleTestCases(newSampleTestCases);
  };

  const handleDeleteHiddenTestCase = (index) => {
    const newHiddenTestCases = hiddenTestCases.filter((_, i) => i !== index);
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
      history.push('/questions'); // Navigate back to question list
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
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required
        >
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
            <button type="button" onClick={() => handleDeleteSampleTestCase(index)}>Delete</button>
          </div>
        ))}
        <button type="button" onClick={() => setSampleTestCases([...sampleTestCases, { input: '', expectedOutput: '' }])}>
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
            <button type="button" onClick={() => handleDeleteHiddenTestCase(index)}>Delete</button>
          </div>
        ))}
        <button type="button" onClick={() => setHiddenTestCases([...hiddenTestCases, { input: '', expectedOutput: '' }])}>
          Add Hidden Test Case
        </button>
        <button type="submit">Submit</button>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default AddQuestion;