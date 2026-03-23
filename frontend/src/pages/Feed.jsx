import React, { useEffect, useState } from "react";
import { getFeed, toggleLike } from "./api";

const Feed = () => {
  const currentUserEmail = localStorage.getItem("email");
  const userId = localStorage.getItem("userId"); // 🔥 IMPORTANT
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    const data = await getFeed(token);
    setPosts(data);
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      alert("Deleted ✅");
      fetchFeed();

    } catch (err) {
      console.log(err);
      alert("Error deleting ❌");
    }
  };

  // 🔥 LIKE
  const handleLike = async (postId) => {
    try {
      console.log("Sending Like:", postId, userId); // debug

      const data = await toggleLike(postId, token, userId);

      // 🔥 UI update without reload (better UX)
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likeCount: data.likeCount }
            : post
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button onClick={() => window.location.href = "/create"}>
        Create Post
      </button>

      <h2>Feed</h2>

      {posts.length === 0 && <p>No posts yet</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
          }}
        >
          <p>{post.content}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="post"
              style={{ maxWidth: "100%" }}
            />
          )}

          <p>By: {post.user?.username}</p>
          <p>{new Date(post.createdAt).toLocaleString()}</p>

          {/* 🔥 LIKE SECTION */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => handleLike(post.id)}>
              👍 Like
            </button>

            <span style={{ marginLeft: "10px" }}>
              {post.likeCount || 0} Likes
            </span>
          </div>

          {/* 🔥 DELETE (only own post) */}
          {post.user?.email === currentUserEmail && (
            <button onClick={() => handleDelete(post.id)}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feed;