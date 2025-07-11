// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.author) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingPost) {
        // Update existing post
        await axios.put(`${API_URL}/posts/${editingPost._id}`, formData);
      } else {
        // Create new post
        await axios.post(`${API_URL}/posts`, formData);
      }
      
      // Reset form and refresh posts
      setFormData({ title: '', content: '', author: '' });
      setShowForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    }
  };

  // Handle edit
  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author
    });
    setEditingPost(post);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${API_URL}/posts/${id}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ title: '', content: '', author: '' });
    setEditingPost(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>My Blog Platform</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + New Post
          </button>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* Post Form */}
          {showForm && (
            <div className="post-form">
              <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter post title..."
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    placeholder="Your name..."
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your post content..."
                    rows="8"
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingPost ? 'Update Post' : 'Publish Post'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posts List */}
          <div className="posts">
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet. Create your first post!</p>
              </div>
            ) : (
              posts.map(post => (
                <article key={post._id} className="post-card">
                  <div className="post-header">
                    <h2>{post.title}</h2>
                    <div className="post-actions">
                      <button 
                        className="btn btn-edit"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-delete"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="post-meta">
                    <span>By {post.author}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="post-content">
                    {post.content}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;


