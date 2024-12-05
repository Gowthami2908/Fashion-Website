import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css'; // Add CSS styling
import Gown2 from '../images/gown2.jpeg';
import Half from '../images/half.jpeg';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSignupClick = () => {
    navigate('/signup'); // Navigate to the signup page when the button is clicked
  };

  return (
    <div className='border'>
      <div className="home-container">
        <div className="home-left">
          <h1>Welcome to<br></br> THE FASHION WORLD!</h1>
          <h4>"Where the journey of style and trend begins..."</h4>
          <p> Are you a fashion enthusiast and would love to exhibit your designs and explore many new trends?</p>
          <h4>Woohoo! You are at the right place.</h4>
          <h4>Start your style hunt right now by signing up here!</h4>
          
          <button className="signup-button" onClick={handleSignupClick}>
            Sign Up
          </button> {/* Added button for Sign Up */}
        </div>
        
        <div className='home-right'>
          <img src={Gown2} alt="gown2"/>
          <img src={Half} alt="half"/>
        </div>
      </div>
    </div>
  );
};

export default Home;


