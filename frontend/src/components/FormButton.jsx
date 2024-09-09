import React from 'react';
import PropTypes from 'prop-types';
import './FormButton.css'; // Include if you have CSS styles for the form button

const FormButton = ({ type, onClick, children, className, disabled }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`form-button ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

FormButton.propTypes = {
    type: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

FormButton.defaultProps = {
    type: 'button',
    onClick: () => {},
    className: '',
    disabled: false,
};

export default FormButton;
