import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFeed, toggleLike, getComments, addComment, deleteComment } from "./api";

const Feed = () => {
  const currentUserEmail = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

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

  const handleLike = async (postId) => {
    try {
      const data = await toggleLike(postId, token, userId);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likeCount: data.likeCount, liked: data.liked }
            : post
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchComments = async (postId) => {
    const data = await getComments(postId);
    setComments((prev) => ({ ...prev, [postId]: data }));
  };

  const handleAddComment = async (postId) => {
    try {
      if (!newComment[postId]) return;

      const commentData = {
        content: newComment[postId],
        user: { id: userId },
        post: { id: postId },
      };

      await addComment(commentData, token);
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId, token);
      fetchComments(postId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* 🔥 NAVBAR */}
      <Navbar />

      {/* 🔥 CENTERED FEED */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "600px", padding: "20px" }}>

          <button
            onClick={() => (window.location.href = "/create")}
            style={{
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer"
            }}
          >
            Create Post
          </button>

          <h2>Feed</h2>

          {posts.length === 0 && <p>No posts yet</p>}

          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              <p>{post.content}</p>

              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="post"
                  style={{ width: "100%", borderRadius: "10px" }}
                />
              )}

              <p><b>By:</b> {post.user?.username}</p>
              <p style={{ fontSize: "12px", color: "gray" }}>
                {new Date(post.createdAt).toLocaleString()}
              </p>

              {/* LIKE */}
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleLike(post.id)}>
                  {post.liked ? "💔 Unlike" : "👍 Like"}
                </button>

                <span style={{ marginLeft: "10px" }}>
                  {post.likeCount || 0} Likes
                </span>
              </div>

              {/* DELETE */}
              {post.user?.email === currentUserEmail && (
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{ marginTop: "5px", color: "red" }}
                >
                  Delete
                </button>
              )}

              {/* COMMENTS */}
              <div style={{ marginTop: "15px" }}>
                <button onClick={() => fetchComments(post.id)}>
                  Show Comments
                </button>

                {(comments[post.id] || []).map((c) => (
                  <div
                    key={c.id}
                    style={{
                      borderTop: "1px solid #eee",
                      marginTop: "5px",
                      paddingTop: "5px"
                    }}
                  >
                    <p>{c.content}</p>
                    <small>By: {c.user?.username}</small>

                    {c.user?.email === currentUserEmail && (
                      <button
                        onClick={() => handleDeleteComment(c.id, post.id)}
                        style={{ marginLeft: "10px", color: "red" }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}

                <div style={{ marginTop: "10px" }}>
                  <input
                    placeholder="Write a comment..."
                    value={newComment[post.id] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    style={{
                      width: "70%",
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc"
                    }}
                  />

                  <button
                    onClick={() => handleAddComment(post.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Feed;