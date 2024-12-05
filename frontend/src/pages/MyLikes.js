import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyLikes.css';

const MyLikes = () => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    // Fetch user's liked posts
    axios.get('/api/users/mylikes?userId=user-id-here')
      .then(response => setLikedPosts(response.data))
      .catch(error => console.error('Error fetching liked posts:', error));
  }, []);

  return (
    <div className="likes-container">
      <h2>My Likes</h2>
      <div className="liked-posts-list">
        {likedPosts.map(post => (
          <div key={post._id} className="liked-post-card">
            <img src={post.imageUrl} alt={post.caption} />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLikes;
