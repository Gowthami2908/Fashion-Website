import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import React, { useState, useEffect } from 'react';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import MyLikes from './pages/MyLikes';
import NavBar from './components/NavBar';
import About from './pages/About';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Welcome from './pages/Welcome'; // Import Welcome page

function App() {
  const [username, setUsername] = useState(null);

  // Retrieve username from localStorage when the app loads
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    console.log(storedUsername);
    if (storedUsername) {
      setUsername(storedUsername); // Update the username state
    }
  }, []);

  const isAuthenticated = username !== null; 

  return (
    <Router>
      <div className="App">
        {/* Pass the dynamic username and authentication status */}
        <NavBar isAuthenticated={isAuthenticated} username={username} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/mylikes" element={<MyLikes />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome username={username} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
