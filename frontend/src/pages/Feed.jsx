import React, { useEffect, useState } from "react";
import { getFeed } from "./api";

const Feed = () => {
  const currentUserEmail = localStorage.getItem("email");
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    const data = await getFeed(token);
    setPosts(data);
  };

  
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

  return (
    <div>
      <button onClick={() => window.location.href = "/create"}>
        Create Post
      </button>

      <h2>Feed</h2>

      {posts.length === 0 && <p>No posts yet</p>}

      {posts.map((post) => (
        <div key={post.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p>{post.content}</p>

          {post.image_url && (
            <img src={post.image_url} alt="post" style={{ maxWidth: "100%" }} />
          )}

          <p>By: {post.user?.username}</p>

          <p>{new Date(post.createdAt).toLocaleString()}</p>

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