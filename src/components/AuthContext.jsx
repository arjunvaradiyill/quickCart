import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (via localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    // Generate a mock token for development
    const mockToken = `mock_token_${Date.now()}_${userData.email.replace('@', '_')}`;
    
    // Add token to user data
    const userWithToken = {
      ...userData,
      token: mockToken
    };
    
    // Set user state and save to localStorage
    setUser(userWithToken);
    localStorage.setItem('user', JSON.stringify(userWithToken));
    
    // Save token separately for easy access
    localStorage.setItem('token', mockToken);
    
    return true;
  };

  // Register function
  const register = (userData) => {
    // Generate a mock token for development
    const mockToken = `mock_token_${Date.now()}_${userData.email.replace('@', '_')}`;
    
    // Add token to user data
    const userWithToken = {
      ...userData,
      token: mockToken
    };
    
    // Set user state and save to localStorage
    setUser(userWithToken);
    localStorage.setItem('user', JSON.stringify(userWithToken));
    
    // Save token separately for easy access
    localStorage.setItem('token', mockToken);
    
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 