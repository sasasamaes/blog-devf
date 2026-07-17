import { SUPABASE_URL, SUPABASE_KEY } from '../utils/supabase';

const POSTS_API_URL = `${SUPABASE_URL}/rest/v1/posts`;

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'return=representation',
  };
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
export async function createPost(postData) {
  const response = await fetch(POSTS_API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
}

//put actualizar post
export async function updatePost(postId, postData) {
  const response = await fetch(`${POSTS_API_URL}?id=eq.${postId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Failed to update post');
  }

  return response.json();
}

//delete eliminar post
export async function deletePost(postId) {
  const response = await fetch(`${POSTS_API_URL}?id=eq.${postId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });   
    if (!response.ok) {
    throw new Error('Failed to update post');
  }
}


