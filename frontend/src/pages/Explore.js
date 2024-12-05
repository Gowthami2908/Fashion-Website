import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState('');

  // Fetch all posts using POST method
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/post/fetch-all', {}); // Empty POST body
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const userId = 'user-id-here'; // Replace with the actual user ID
      const response = await axios.post('http://localhost:5000/api/post/like', { postId, userId });
      if (response.status === 200) {
        // Update the post's like count locally
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, likes: [...post.likes, userId] } : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    try {
      const userId = 'user-id-here'; // Replace with the actual user ID
      await axios.post('http://localhost:5000/api/post/comment', {
        postId,
        userId,
        text: commentText,
      });
      // Update the post's comment list locally
      setPosts(posts.map(post =>
        post._id === postId ? { ...post, comments: [...post.comments, { text: commentText, postedBy: userId }] } : post
      ));
      setCommentText(''); // Clear input
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="explore-container">
      {posts.map(post => (
        <div key={post._id} className="post-card">
          <img src={`http://localhost:5000/${post.imageUrl}`} alt="Fashion" />
          <p>{post.caption}</p>
          <div className="post-actions">
            <button onClick={() => handleLike(post._id)} className="like-button">
              <FontAwesomeIcon icon={faHeart} className="heart-icon" /> {post.likes.length}
            </button>
            <div className="comments-section">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={commentText} 
                onChange={e => setCommentText(e.target.value)} 
              />
              <button onClick={() => handleComment(post._id)}>Comment</button>
            </div>
            <div className="comments-list">
              {post.comments.map((comment, idx) => (
                <p key={idx}>{comment.text}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Explore;
