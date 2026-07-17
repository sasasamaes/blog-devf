import { SUPABASE_URL, SUPABASE_KEY } from '../utils/supabase';

const POSTS_API_URL = `${SUPABASE_URL}/rest/v1/posts`;

function getHeaders(accessToken) {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Prefer': 'return=representation',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    headers['Authorization'] = `Bearer ${SUPABASE_KEY}`;
  }

  return headers;
}

// Get listar posts
export async function fetchPosts() {
  const response = await fetch(POSTS_API_URL, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}

//post crear post
export async function createPost(postData, accessToken, authorEmail) {
  const payload = { ...postData, author_email: authorEmail };

  const response = await fetch(POSTS_API_URL, {
    method: 'POST',
    headers: getHeaders(accessToken),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create post');
  }

  return response.json();
}

//put actualizar post
export async function updatePost(postId, postData, accessToken) {
  const response = await fetch(`${POSTS_API_URL}?id=eq.${postId}`, {
    method: 'PUT',
    headers: getHeaders(accessToken),
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update post');
  }

  return response.json();
}

//delete eliminar post
export async function deletePost(postId, accessToken) {
  const response = await fetch(`${POSTS_API_URL}?id=eq.${postId}`, {
    method: 'DELETE',
    headers: getHeaders(accessToken),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete post');
  }
}


