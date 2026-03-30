import React, { useEffect, useState } from "react";
import AppNavbar from "../components/Navbar";
import { Container, Card, Row, Col, Dropdown } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getFeed,
  toggleLike,
  getComments,
  addComment,
} from "./api";

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
    const data = await getFeed(token, userId);
    setPosts(data);
  };

  const handleLike = async (postId) => {
    const data = await toggleLike(postId, token, userId);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likeCount: data.likeCount, liked: data.liked }
          : p
      )
    );
  };

  const fetchComments = async (postId) => {
    const data = await getComments(postId);
    setComments((prev) => ({ ...prev, [postId]: data }));
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId]) return;

    await addComment(
      {
        content: newComment[postId],
        user: { id: userId },
        post: { id: postId },
      },
      token
    );

    setNewComment((prev) => ({ ...prev, [postId]: "" }));
    fetchComments(postId);
  };

  const handleDelete = async (id) => {
    try {
      
      await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      fetchFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (post) => {
    localStorage.setItem("editPost", JSON.stringify(post));
    window.location.href = "/edit";
  };

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh" }}>
      <AppNavbar />

      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>

            {posts.map((post) => (
              <Card
                key={post.id}
                className="mb-4"
                style={{
                  backgroundColor: "#141414",
                  border: "1px solid #262626",
                  borderRadius: "14px",
                }}
              >
                <Card.Body>

                  {/* 🔥 HEADER */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    {/* USER */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={
                          post.user?.profilePicture
                            ? post.user.profilePicture.startsWith("http")
                              ? post.user.profilePicture
                              : `http://localhost:8080${post.user.profilePicture}`
                            : `https://ui-avatars.com/api/?name=${post.user?.username}&background=random`
                        }
                        alt={post.user?.username}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "10px",
                          border: "2px solid #333",
                        }}
                      />

                      <div>
                        <div style={{ color: "#fff", fontWeight: "500" }}>
                          {post.user?.username}
                        </div>
                        <small style={{ color: "#a1a1aa" }}>
                          {new Date(post.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>

                    {/* ⋮ MENU */}
                    {post.user?.email === currentUserEmail && (
                      <Dropdown align="end">
                        <Dropdown.Toggle
                        
                          variant="link"
                          style={{
                            color: "#aaa",
                            border: "none",
                            boxShadow: "none",
                          }}
                        >
                          <BsThreeDotsVertical />
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                          style={{
                            backgroundColor: "#1c1c1c",
                            border: "1px solid #333",
                          }}
                        >
                          <Dropdown.Item
                            onClick={() => handleEdit(post)}
                            style={{ color: "#fff" }}
                          >
                            Edit
                          </Dropdown.Item>

                          <Dropdown.Item
                            onClick={() => handleDelete(post.id)}
                            style={{ color: "#ff4d4f" }}
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>

                  {/* CONTENT */}
                  <p style={{ color: "#fff", fontSize: "15px" }}>
                    {post.content}
                  </p>

                  {/* IMAGE */}
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt=""
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    />
                  )}

                  {/* ❤️ LIKE */}
                  <div className="d-flex align-items-center mt-2">
                    <span
                      onClick={() => handleLike(post.id)}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        color: post.liked ? "#ec4899" : "#aaa",
                      }}
                    >
                      {post.liked ? <FaHeart /> : <FaRegHeart />}
                    </span>

                    <span style={{ marginLeft: "8px", color: "#aaa" }}>
                      {post.likeCount || 0} likes
                    </span>
                  </div>

                  {/* COMMENTS */}
                  <div className="mt-3">
                    <button
                      onClick={() => fetchComments(post.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#a855f7",
                        cursor: "pointer",
                        padding: 0,
                        fontSize: "13px",
                      }}
                    >
                      View comments
                    </button>

                    {(comments[post.id] || []).map((c) => (
                      <div key={c.id} style={{ marginTop: "8px", color: "#ddd" }}>
                        <strong style={{ color: "#fff" }}>
                          {c.user?.username}
                        </strong>{" "}
                        {c.content}
                      </div>
                    ))}

                    {/* INPUT */}
                    <div className="d-flex mt-2">
                      <input
                        placeholder="Add a comment..."
                        value={newComment[post.id] || ""}
                        onChange={(e) =>
                          setNewComment((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        style={{
                          flex: 1,
                          background: "#1c1c1c",
                          border: "1px solid #333",
                          borderRadius: "20px",
                          padding: "8px 12px",
                          color: "white",
                        }}
                      />

                      <button
                        onClick={() => handleAddComment(post.id)}
                        style={{
                          marginLeft: "8px",
                          border: "none",
                          borderRadius: "20px",
                          padding: "6px 14px",
                          background:
                            "linear-gradient(90deg,#a855f7,#ec4899)",
                          color: "white",
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>

                </Card.Body>
              </Card>
            ))}

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Feed;