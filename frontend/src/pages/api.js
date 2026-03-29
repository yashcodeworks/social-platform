// src/api.js
import axios from "axios";
export const getFeed = async (token) => {
  try {
    const res = await fetch("http://localhost:8080/api/feed", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // JWT token
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch feed");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
export const toggleLike = async (postId, token, userId) => {
  const res = await fetch(
    `http://localhost:8080/api/likes/${postId}/like?userId=${userId}`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return res.json();
}



export const addComment = async (comment, token) => {
  const res = await fetch("http://localhost:8080/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(comment),
  });

  return res.json();
};

export const getComments = async (postId) => {
  const res = await fetch(`http://localhost:8080/api/comments/post/${postId}`);

  // 🔥 safe handling
  if (!res.ok) {
    return [];
  }

  const text = await res.text();

  return text ? JSON.parse(text) : [];
};

export const deleteComment = async (id, token) => {
  await fetch(`http://localhost:8080/api/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const registerUser = async (userData) => {
  const res = await axios.post("http://localhost:8080/auth/register", userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await axios.post("http://localhost:8080/auth/login", credentials);
  return res.data;
};