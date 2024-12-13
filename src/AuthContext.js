// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context for authentication
const AuthContext = createContext(null);

// Provider component to wrap your app
export const AuthProvider = ({ children }) => {
  // State to track authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login method to set authentication to true
  const login = () => {
    setIsAuthenticated(true);
  };

  // Logout method to set authentication to false
  const logout = () => {
    setIsAuthenticated(false);
  };

  // Provide authentication state and methods to child components
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};