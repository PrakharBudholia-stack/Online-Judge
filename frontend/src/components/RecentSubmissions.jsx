import React, { useState, useEffect } from 'react';
import axiosInstance from '../auth/axiosInstance';
import './RecentSubmissions.css'; // Assuming you have a CSS file for styling

function RecentSubmissions({ questionId }) {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentSubmissions = async () => {
      try {
        const response = await axiosInstance.get(`/api/recent-submissions/${questionId}`);
        setSubmissions(response.data);
      } catch (error) {
        setError('Failed to fetch recent submissions');
      }
    };

    fetchRecentSubmissions();
  }, [questionId]);

  return (
    <div className="recent-submissions-container">
      <h3>Recent Submissions</h3>
      {error && <div className="error">{error}</div>}
      <ul>
        {submissions.map((submission, index) => (
          <li key={index} className={`submission ${submission.passed ? 'passed' : 'failed'}`}>
            <strong>Submission {index + 1}:</strong> {submission.passed ? 'Passed' : 'Failed'}
            <br />
            <strong>Submitted At:</strong> {new Date(submission.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentSubmissions;