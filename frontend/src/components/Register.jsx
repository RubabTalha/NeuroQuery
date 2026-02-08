import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import '../styles/Login.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData.username, formData.email, formData.password);
      alert('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error) {
      alert(error.message || 'Registration failed');
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background" />
      
      <div className="login-form-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <img src="/neuroquery-logo.png" alt="NeuroQuery" />
            </div>
            <h1 className="login-title text-gradient">Create Account</h1>
            <p className="login-subtitle">Join NeuroQuery and explore RAG pipelines</p>
          </div>

          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}
            
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="form-input-container">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Choose a username"
                  disabled={loading}
                />
                <span className="form-icon">👤</span>
              </div>
              {errors.username && (
                <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                  {errors.username}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-container">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                  disabled={loading}
                />
                <span className="form-icon">✉️</span>
              </div>
              {errors.email && (
                <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-container">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Create a password"
                  disabled={loading}
                />
                <span className="form-icon">🔒</span>
              </div>
              {errors.password && (
                <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="form-input-container">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <span className="form-icon">🔒</span>
              </div>
              {errors.confirmPassword && (
                <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary login-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p style={{ color: 'var(--text-secondary)' }}>
              Already have an account? 
              <Link to="/login" className="register-link">Sign In</Link>
            </p>
            
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;