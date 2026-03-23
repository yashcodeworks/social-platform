import React, { useState } from "react";
import AppNavbar from "../components/Navbar";
import { Container, Card } from "react-bootstrap";

const CreatePost = () => {
  const token = localStorage.getItem("token");

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
    if (!content) {
      alert("Post content required ❗");
      return;
    }

    try {
      await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          content,
          image_url: imageUrl,
        }),
      });

      alert("Post created 🚀");
      window.location.href = "/feed";

    } catch (err) {
      console.log(err);
      alert("Error creating post ❌");
    }
  };

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh" }}>
      <AppNavbar />

      <Container className="d-flex justify-content-center mt-5">
        <Card
          style={{
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "#141414",
            border: "1px solid #262626",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <h5 style={{ color: "#fff", marginBottom: "15px" }}>
            Create Post
          </h5>

          {/* TEXT AREA */}
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "100%",
              minHeight: "100px",
              background: "#1c1c1c",
              border: "1px solid #333",
              borderRadius: "10px",
              padding: "10px",
              color: "white",
              resize: "none",
              marginBottom: "12px",
            }}
          />

          {/* IMAGE URL */}
          <input
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{
              width: "100%",
              background: "#1c1c1c",
              border: "1px solid #333",
              borderRadius: "10px",
              padding: "8px",
              color: "white",
              marginBottom: "12px",
            }}
          />

          {/* IMAGE PREVIEW */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "12px",
              }}
            />
          )}

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              border: "none",
              padding: "10px",
              borderRadius: "20px",
              background: "linear-gradient(90deg,#a855f7,#ec4899)",
              color: "white",
              fontWeight: "500",
              fontSize: "15px",
            }}
          >
            Post
          </button>

        </Card>
      </Container>
    </div>
  );
};

export default CreatePost;