// App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Compiler from './components/pages/Compiler';
import Contests from './components/pages/Contests';
import ProblemSet from './components/pages/ProblemSet';
import ProblemDetail from './components/pages/ProblemDetail';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import './styles/main.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<ProblemSet />} />
                <Route path="/compiler" element={<Compiler />} />
                <Route path="/contests" element={<Contests />} />
                <Route path="/problems/:id" element={<ProblemDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
