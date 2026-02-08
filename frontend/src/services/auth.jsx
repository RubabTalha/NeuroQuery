import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('neuroquery_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('neuroquery_token');
    if (token) {
      setUser(JSON.parse(localStorage.getItem('neuroquery_user') || 'null'));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 1,
        email,
        username: email.split('@')[0],
        name: 'Demo User',
        role: 'Admin',
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=ec4899&color=fff`
      };
      
      localStorage.setItem('neuroquery_token', 'demo-token-123');
      localStorage.setItem('neuroquery_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return mockUser;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (username, email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: 'Registration successful. Please login.' 
      };
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('neuroquery_token');
    localStorage.removeItem('neuroquery_user');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};