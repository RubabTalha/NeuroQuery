import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>NeuroQuery Home</h1>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
};

export default Home;