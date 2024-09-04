import React from 'react';
import './Footer.css'; // Include if you have CSS styles for the footer

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
