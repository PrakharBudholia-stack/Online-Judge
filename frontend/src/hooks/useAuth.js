// useAuth.js

import { useState, useEffect } from 'react';
import { getAuthStatus, loginUser, logoutUser } from '../utils/auth';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const status = await getAuthStatus();
            setIsAuthenticated(status);
        };
        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        const result = await loginUser(credentials);
        if (result.success) {
            setIsAuthenticated(true);
        }
    };

    const logout = () => {
        logoutUser();
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        login,
        logout
    };
};

export default useAuth;
