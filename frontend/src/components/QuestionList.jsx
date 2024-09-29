import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../auth/axiosInstance';
import './QuestionList.css'; // Import the CSS file

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [sortCriteria, setSortCriteria] = useState('title'); // State for sort criteria
  const [sortOrder, setSortOrder] = useState('asc'); // State for sort order
  const questionsPerPage = 10; // Number of questions per page

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('QuestionList.jsx: Fetching questions');
        const response = await axiosInstance.get('/api/questions');
        setQuestions(response.data);
        console.log('QuestionList.jsx: Questions fetched successfully', response.data);
      } catch (error) {
        console.error('QuestionList.jsx: Error fetching questions', error);
        setError('Error fetching questions');
      }
    };

    fetchQuestions();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSortCriteriaChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };
  

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedQuestions = filteredQuestions.sort((a, b) => {
    if (sortCriteria === 'title') {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    } else if (sortCriteria === 'difficulty') {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      if (sortOrder === 'asc') {
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      } else {
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      }
    }
    return 0;
  });

  // Calculate the questions to display on the current page
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = sortedQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="question-list-container">
      <h1 className="heading">Questions</h1>
      <input
        type="text"
        placeholder="Search questions..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="sort-controls">
        <label>
          Sort by:
          <select value={sortCriteria} onChange={handleSortCriteriaChange}>
            <option value="title">Title</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </label>
        <label>
          Order:
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
      <div className="legend">
        <span className="legend-item easy">Easy</span>
        <span className="legend-item medium">Medium</span>
        <span className="legend-item hard">Hard</span>
      </div>
      <div className="questions">
        {currentQuestions.map((question) => (
          <div key={question._id} className={`question-box ${question.difficulty}`}>
            <Link to={`/questions/${question._id}`}>{question.title}</Link>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionList;