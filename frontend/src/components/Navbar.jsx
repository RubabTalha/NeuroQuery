import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import '../styles/Dashboard.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-logo">
          <div className="logo-small">
            <img src="/neuroquery-logo.png" alt="NeuroQuery" />
          </div>
          <span className="navbar-brand">NeuroQuery</span>
        </Link>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-name">
              👤 {user?.username}
            </div>
            <div className="user-email">{user?.email}</div>
          </div>
          
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;