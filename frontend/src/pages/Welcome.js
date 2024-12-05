import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css'; // Link to CSS for styling

const Welcome = ({ username }) => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h2>Welcome, {username}!</h2>
      <div className="tab-buttons">
        <button className="explore-button" onClick={() => navigate('/explore')}>
          Explore
        </button>
        <button className="post-button" onClick={() => navigate(`/profile/${username}`)}>
          Post
        </button>
      </div>
    </div>
  );
};

export default Welcome;
