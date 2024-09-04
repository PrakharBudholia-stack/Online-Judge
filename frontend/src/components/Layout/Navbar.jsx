import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Include if you have CSS styles for the navbar

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">MyApp</Link>
            </div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/compiler">Compiler</Link>
                </li>
                <li className="nav-item">
                    <Link to="/contests">Contests</Link>
                </li>
                <li className="nav-item">
                    <Link to="/problems">Problems</Link>
                </li>
                <li className="nav-item">
                    <Link to="/login">Login</Link>
                </li>
                <li className="nav-item">
                    <Link to="/register">Register</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
