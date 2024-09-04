// auth.js

// Mock API URL
const API_URL = 'http://localhost:5000/api/auth';

export const getAuthStatus = async () => {
    try {
        const response = await fetch(`${API_URL}/status`, {
            credentials: 'include'
        });
        const data = await response.json();
        return data.isAuthenticated;
    } catch (error) {
        console.error('Failed to fetch auth status:', error);
        return false;
    }
};

export const loginUser = async ({ email, password }) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to login:', error);
        return { success: false };
    }
};

export const logoutUser = () => {
    // Clear cookies or tokens as needed
    console.log('User logged out');
};
