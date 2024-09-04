import React from 'react';
import PropTypes from 'prop-types';
import './Card.css'; // Include if you have CSS styles for the card

const Card = ({ title, content, footer }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h2>{title}</h2>
            </div>
            <div className="card-body">
                <p>{content}</p>
            </div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    footer: PropTypes.node,
};

Card.defaultProps = {
    footer: null,
};

export default Card;
