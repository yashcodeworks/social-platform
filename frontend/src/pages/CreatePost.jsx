import { useState } from "react";
import axios from "axios";

function CreatePost() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handlePost = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/posts",
        {
          content: content,
          image_url: imageUrl,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      alert("Post created 🚀");
      window.location.href = "/feed";

    } catch (err) {
      console.log(err);
      alert("Error creating post ❌");
    }
  };

  return (
    <div>
      <h2>Create Post</h2>

      <textarea
        placeholder="Write something..."
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        placeholder="Image URL"
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button onClick={handlePost}>Post</button>
    </div>
  );
}

export default CreatePost;