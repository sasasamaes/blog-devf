import { useState, useEffect, useCallback } from 'react'
import { supabase } from './utils/supabase'
import { fetchPosts, createPost, updatePost, deletePost } from './api/postsApi'
import './App.css'


export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);

  const fetchPostsData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPostsData();
  }, [fetchPostsData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage('');

    const postData = { title, content };

    try {
      if (editingPostId) {
        await updatePost(editingPostId, postData);
        setSuccessMessage('Post updated successfully');
      } else {
        await createPost(postData);
        setSuccessMessage('Post created successfully');
      }
      setTitle('');
      setContent('');
      setEditingPostId(null);
      fetchPostsData();
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('Failed to submit post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPostId(post.id);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(postId);
      setSuccessMessage('Post deleted successfully');
      fetchPostsData();
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };  



  return (
    <div className="container">
      <h1>My Blog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
        />
        <button type="submit" disabled={submitting}>
          {editingPostId ? 'Update Post' : 'Create Post'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <button onClick={() => handleEdit(post)}>Edit</button>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>  
  )
}