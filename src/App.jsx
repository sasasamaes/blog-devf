import { useState, useEffect, useCallback } from 'react'
import { supabase } from './utils/supabase'
import { fetchPosts, createPost, updatePost, deletePost } from './api/postsApi'
import './App.css'
import AuthForm from './components/AuthForm'


export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [session, setSession] = useState(null);
  const user = session?.user ?? null;

  const getAccessToken = () => session?.access_token ?? null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

    const accessToken = getAccessToken();

    if (!accessToken) {
      setError('You must be logged in to create or edit posts');
      setSubmitting(false);
      return;
    }

    const postData = { title, content };

    try {
      if (editingPostId) {
        await updatePost(editingPostId, postData, accessToken);
        setSuccessMessage('Post updated successfully');
      } else {
        await createPost(postData, accessToken, user.email);
        setSuccessMessage('Post created successfully');
      }
      setTitle('');
      setContent('');
      setEditingPostId(null);
      fetchPostsData();
    } catch (error) {
      console.error('Error submitting post:', error);
      setError(error.message || 'Failed to submit post');
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

    const accessToken = getAccessToken();

    if (!accessToken) {
      setError('You must be logged in to delete posts');
      return;
    }

    try {
      await deletePost(postId, accessToken);
      setSuccessMessage('Post deleted successfully');
      fetchPostsData();
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error.message || 'Failed to delete post');
    }
  };



  return (
    <div className="container">
      <h1>My Blog</h1>
      <AuthForm session={session} setSession={setSession} />
      {!user && (
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: '20px' }}>
          Please log in to create, edit, or delete posts.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting || !user}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting || !user}
        />
        <button type="submit" disabled={submitting || !user}>
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
              {post.author_email && (
                <p style={{ fontSize: '12px', color: '#718096' }}>
                  By {post.author_email}
                </p>
              )}
              {user && (
                <>
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>  
  )
}