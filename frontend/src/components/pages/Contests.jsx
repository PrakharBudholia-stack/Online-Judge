import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contests.css'; // Ensure you have a CSS file to style the contests page

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get('/api/contests'); // Adjust this URL based on your backend route
                setContests(response.data);
            } catch (err) {
                setError('Failed to load contests.');
            }
            setLoading(false);
        };

        fetchContests();
    }, []);

    if (loading) {
        return <div className="contests-page">Loading contests...</div>;
    }

    if (error) {
        return <div className="contests-page error">{error}</div>;
    }

    return (
        <div className="contests-page">
            <h1>Contests</h1>
            {contests.length > 0 ? (
                <ul className="contests-list">
                    {contests.map((contest) => (
                        <li key={contest.id} className="contest-item">
                            <h3>{contest.name}</h3>
                            <p>{contest.description}</p>
                            <button>View Contest</button> {/* Add a link to contest details */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No contests available at the moment.</p>
            )}
        </div>
    );
};

export default Contests;
