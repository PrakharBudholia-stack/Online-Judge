// ProblemSet.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProblemSet.css'; // Ensure you have a CSS file for styling

const ProblemSet = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('/api/problems'); // Adjust this route according to your backend
        setProblems(response.data);
      } catch (err) {
        setError('Failed to load problems.');
      }
      setLoading(false);
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div className="problem-set">Loading problems...</div>;
  }

  if (error) {
    return <div className="problem-set error">{error}</div>;
  }

  return (
    <div className="problem-set">
      <h1>Practice Problems</h1>
      {problems.length > 0 ? (
        <ul className="problem-list">
          {problems.map((problem) => (
            <li key={problem.id} className="problem-item">
              <h3>{problem.title}</h3>
              <p>{problem.difficulty}</p>
              <Link to={`/problems/${problem.id}`}>View Problem</Link> {/* Dynamic route to ProblemDetail */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No problems available at the moment.</p>
      )}
    </div>
  );
};

export default ProblemSet;
