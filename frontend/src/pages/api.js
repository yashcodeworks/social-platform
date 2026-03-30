// src/api.js
import axios from "axios";
export const getFeed = async (token, userId) => {
  try {
    const url = userId
      ? `http://localhost:8080/api/feed?userId=${userId}`
      : "http://localhost:8080/api/feed";
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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

export const getUserProfile = async (userId, token) => {
  const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + token },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const updateUserProfile = async (data, token) => {
  const res = await fetch("http://localhost:8080/api/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

export const getUserPosts = async (userId, token) => {
  const res = await fetch(`http://localhost:8080/api/posts/user/${userId}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + token },
  });
  if (!res.ok) throw new Error("Failed to fetch user posts");
  return res.json();
};

export const uploadProfilePicture = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("http://localhost:8080/api/users/profile-picture", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      // Do NOT set Content-Type here — browser sets it automatically with boundary
    },
    body: formData,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to upload profile picture");
  }
  return res.json();
};