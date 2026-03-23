import React, { useEffect, useState } from "react";
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

  // 🔥 FETCH POSTS
  const fetchFeed = async () => {
    const data = await getFeed(token);
    setPosts(data);
  };

  // 🔥 DELETE POST
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

  // 🔥 FETCH COMMENTS
  const fetchComments = async (postId) => {
    const data = await getComments(postId);

    setComments((prev) => ({
      ...prev,
      [postId]: data,
    }));
  };

  // 🔥 ADD COMMENT
  const handleAddComment = async (postId) => {
    try {
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

  // 🔥 DELETE COMMENT
  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId, token);
      fetchComments(postId);
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

          {/* 🔥 LIKE */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => handleLike(post.id)}>
              {post.liked ? "💔 Unlike" : "👍 Like"}
            </button>

            <span style={{ marginLeft: "10px" }}>
              {post.likeCount || 0} Likes
            </span>
          </div>

          {/* 🔥 DELETE POST */}
          {post.user?.email === currentUserEmail && (
            <button onClick={() => handleDelete(post.id)}>
              Delete
            </button>
          )}

          {/* 🔥 COMMENTS */}
          <div style={{ marginTop: "15px" }}>
            <button onClick={() => fetchComments(post.id)}>
              Show Comments
            </button>

            {/* comment list */}
            {(comments[post.id] || []).map((c) => (
              <div
                key={c.id}
                style={{
                  borderTop: "1px solid #eee",
                  marginTop: "5px",
                }}
              >
                <p>{c.content}</p>
                <small>By: {c.user?.username}</small>

                {c.user?.email === currentUserEmail && (
                  <button
                    onClick={() => handleDeleteComment(c.id, post.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}

            {/* add comment */}
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
              />

              <button onClick={() => handleAddComment(post.id)}>
                Comment
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;