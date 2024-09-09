// ProblemDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProblemDetail.css'; // Include if you have CSS styles for problem detail

const ProblemDetail = () => {
  const { id } = useParams(); // Get problem ID from URL
  const [problem, setProblem] = useState(null);
  const [solution, setSolution] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`/api/problems/${id}`); // Fetch individual problem details
        setProblem(response.data);
      } catch (err) {
        setError('Failed to load problem details.');
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/problems/${id}/submit`, { code: solution }); // Adjust this route based on your backend
      setOutput(response.data.output); // Display the result of the submission
    } catch (err) {
      setOutput('Submission failed.');
    }
    setLoading(false);
  };

  if (!problem) {
    return <div className="problem-detail">Loading problem details...</div>;
  }

  return (
    <div className="problem-detail">
      <h1>{problem.title}</h1>
      <p>{problem.description}</p>

      <h3>Input:</h3>
      <pre>{problem.inputDescription}</pre>

      <h3>Output:</h3>
      <pre>{problem.outputDescription}</pre>

      <textarea
        rows="10"
        cols="50"
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        placeholder="Write your solution here..."
      ></textarea>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Solution'}
      </button>

      {output && (
        <div className="submission-output">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ProblemDetail;
