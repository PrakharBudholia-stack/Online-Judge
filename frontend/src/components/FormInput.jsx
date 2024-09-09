import React from 'react';
import PropTypes from 'prop-types';
import './FormInput.css'; // Include if you have CSS styles for the form input

const FormInput = ({ type, name, value, onChange, placeholder, className, required }) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-input ${className}`}
            required={required}
        />
    );
};

FormInput.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
};

FormInput.defaultProps = {
    type: 'text',
    value: '',
    placeholder: '',
    className: '',
    required: false,
};

export default FormInput;
