// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import './Profile.css';

// const Profile = () => {
//   const { username } = useParams();
//   const [user, setUser] = useState({});
//   const [posts, setPosts] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     // Fetch user data using a POST request
//     axios.post('http://localhost:5000/api/users/profile', { username })
//       .then((response) => {
//         setUser(response.data.user);
//         setPosts(response.data.posts);
//       })
//       .catch((error) => {
//         console.error('Error fetching user data:', error);
//         setErrorMessage('Failed to fetch user data.');
//       });
//   }, [username]);

//   return (
//     <div className="profile-container">
//       <div className="profile-header">
//         <h2>{user.username}</h2>
//         <p>{user.bio}</p>
//         <div className="profile-stats">
//           <span>{user.followers?.length} Followers</span>
//           <span>{user.following?.length} Following</span>
//         </div>
//       </div>

//       <div className="profile-posts">
//         <h3>My Posts</h3>
//         <div className="posts-list">
//           {posts.map(post => (
//             <div key={post._id} className="post-card">
//               <img src={post.imageUrl} alt={post.caption} />
//               <p>{post.caption}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       {errorMessage && <p className="error">{errorMessage}</p>}
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Fetch user data using POST
    const fetchUserData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/users/profile', { username });
        setUser(response.data.user);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username]);

  // const handleLike = async (postId) => {
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/post/like', {
  //       postId,
  //       userId: user._id, // Assuming user ID is available
  //     });

  //     // Optionally, you can update the posts state to reflect the like
  //     console.log(response.data.message);
  //   } catch (error) {
  //     console.error('Error liking post:', error);
  //   }
  // };
  const likePost = async (postId) => {
    try {
      const userId = user._id; // Assuming you have the user ID in user object
      const response=await axios.post('http://localhost:5000/api/post/like', { postId, userId });
      // Update the posts state with the new like count
      if (response.status === 200) {
        // Update the posts state with the new like count
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, likes: [...post.likes, userId] } : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error.response?.data || error.message);
    }
  };
  const deletePost = async (postId) => {
    try {
      const userId = user._id;
      const response = await axios.delete('http://localhost:5000/api/post/delete', {
        data: { postId, userId },
      });
  
      if (response.status === 200) {
        // Update the posts state by removing the deleted post
        setPosts(posts.filter((post) => post._id !== postId));
        console.log('Post deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
    }
  };
  
  const addComment = async (postId) => {
    try {
      const userId = user._id; // Assuming you have the user ID in user object
      await axios.post('http://localhost:5000/api/post/comment', {
        postId,
        userId,
        text: comment,
      });
      // Update the posts state with the new comment
      setPosts(posts.map(post =>
        post._id === postId ? { ...post, comments: [...post.comments, { text: comment, postedBy: userId }] } : post
      ));
      setComment(''); // Clear input
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle form submission for creating a new post
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);
    formData.append('userId', user._id); // Assuming user ID is available

    // Debugging: Log the FormData entries
for (let [key, value] of formData.entries()) {
  console.log(`${key}: ${value}`);
}

    try {
      const response = await axios.post('http://localhost:5000/api/post/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data for file upload
        },
      });

      // Optionally, fetch updated posts after submission
      setCaption('');
      setImage(null);
      // Fetch updated posts or add the new post to the posts array
      const newPost = response.data.post; // Get the newly created post from response
      setPosts((prevPosts) => [...prevPosts, newPost]); // Update posts state
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{user.username}</h2>
        <p>- {user.bio}</p>
      </div>

      <div className="post-creation">
        <h3>Create a New Post</h3>
        <form>
          <input
            type="text"
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />
          <input
            type="file"
            //accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <button type="submit" onClick={handleSubmit}>Post</button>
        </form>
      </div>

      <div className="profile-posts">
        <h3>My Posts</h3>
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <img src={`http://localhost:5000/${post.imageUrl}`} alt={post.caption} />
              <p>{post.caption}</p>
              {/* Keeping the existing likes functionality intact */}
              <button onClick={() => likePost(post._id)} className="like-button">
              <FontAwesomeIcon icon={faHeart} className="heart-icon" /> {post.likes.length}
            </button>
              {/* Add other post functionalities like comments if needed */}
              <div className="comments-section">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={() => addComment(post._id)}>Comment</button>
              </div>
              <div className="comments-list">
                {post.comments.map((comment, index) => (
                  <p key={index}>{comment.text}</p>
                ))}
              </div>
              <button onClick={() => deletePost(post._id)} className="delete-button">
      Delete
    </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;



