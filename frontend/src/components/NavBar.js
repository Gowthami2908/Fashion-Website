import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import Logo from '../images/logo.png';

const NavBar = ({ isAuthenticated, username }) => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img className="nav-logo" src={Logo} alt="fashion"/>
      </div>
      <div className="nav-right">
        <ul>
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/explore">EXPLORE</Link></li>
          {isAuthenticated ? (
            <>
              
              
              <li><Link to="/mylikes">MY SAVES</Link></li>
              <li><Link to={`/profile/${username}`}>MY PROFILE</Link></li>
              <li><Link to="/signup">SIGN UP</Link></li>
              
            </>
          ) : (
            <>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
