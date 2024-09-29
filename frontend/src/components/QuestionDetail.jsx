import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../auth/axiosInstance';
import CodeEditor from './CodeEditor'; // Assuming you have a CodeEditor component
import './QuestionDetail.css'; // Assuming you have a CSS file for styling

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('javascript'); // Default language

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axiosInstance.get(`/api/questions/${id}`);
        setQuestion(response.data);
      } catch (error) {
        setError('Error fetching question');
      }
    };

    fetchQuestion();
  }, [id]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="question-detail-container">
      <div className="question-container">
        <div className="question-detail">
          <h1>{question.title}</h1>
          <p className={`difficulty ${question.difficulty}`}>{question.difficulty}</p>
          <p>{question.description}</p>
        </div>
        <div className="test-cases">
          <h2>Sample Test Cases</h2>
          {question.sampleTestCases.map((testCase, index) => (
            <div key={index} className="test-case-box">
              <strong>Input:</strong> {testCase.input} <br />
              <strong>Expected Output:</strong> {testCase.expectedOutput}
            </div>
          ))}
        </div>
      </div>
      <div className="separator"></div>
      <div className="code-editor-container">
        <div className="code-editor-content">
          <CodeEditor questionId={question._id} language={language} />
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;