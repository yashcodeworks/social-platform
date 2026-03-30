import { useState, useEffect, useRef } from "react";
import { Container, Card, Spinner, Button, Modal, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import { getUserProfile, getUserPosts, updateUserProfile, toggleLike, uploadProfilePicture } from "./api";
import { FaHeart, FaRegComment, FaEdit, FaCamera } from "react-icons/fa";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");
  const effectiveUserId = id || currentUserId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile States
  const [showEdit, setShowEdit] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileData, postsData] = await Promise.all([
          getUserProfile(effectiveUserId, token),
          getUserPosts(effectiveUserId, token)
        ]);

        setProfile(profileData);
        setPosts(postsData);
        setEditBio(profileData.bio || "");
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [effectiveUserId, token, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleOpenEdit = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditBio(profile.bio || "");
    setShowEdit(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let updatedData;

      if (selectedFile) {
        // Upload picture first
        updatedData = await uploadProfilePicture(selectedFile, token);
        // Also update bio if it changed
        if (editBio !== (profile.bio || "")) {
          updatedData = await updateUserProfile({ bio: editBio, profilePicture: updatedData.profilePicture }, token);
        }
      } else {
        updatedData = await updateUserProfile({ bio: editBio }, token);
      }

      setProfile(updatedData);
      setShowEdit(false);
    } catch (err) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const data = await toggleLike(postId, token, currentUserId);
      setPosts(posts.map((p) => (p.id === postId ? { ...p, likeCount: data.likeCount, liked: data.liked } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  // Resolve image URL — supports relative /uploads/ paths and full URLs
  const resolveImageUrl = (src) => {
    if (!src) return null;
    if (src.startsWith("http")) return src;
    return `http://localhost:8080${src}`;
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "white" }}>
        <AppNavbar />
        <Container className="d-flex justify-content-center align-items-center mt-5">
           <Spinner animation="border" variant="light" />
        </Container>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "white" }}>
        <AppNavbar />
        <Container className="d-flex justify-content-center mt-5">
          <h4>User not found.</h4>
        </Container>
      </div>
    );
  }

  const isMyProfile = String(currentUserId) === String(effectiveUserId);
  const avatarUrl = resolveImageUrl(profile.profilePicture)
    || `https://ui-avatars.com/api/?name=${profile.username}&background=random`;

  return (
    <div style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", paddingBottom: "50px" }}>
      <AppNavbar />

      <Container className="mt-4" style={{ maxWidth: "650px" }}>

        {/* PROFILE HEADER CARD */}
        <Card
            className="mb-4 shadow-lg position-relative overflow-hidden"
            style={{ backgroundColor: "#141414", color: "white", borderRadius: "16px", border: "1px solid #262626" }}
        >
          {/* Gradient Banner */}
          <div style={{ width: "100%", height: "140px", background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)" }}></div>

          <Card.Body className="text-center px-4 pb-4" style={{ marginTop: "-70px" }}>
            {/* Avatar with camera overlay for own profile */}
            <div
              className="position-relative d-inline-block mb-3"
              style={{ cursor: isMyProfile ? "pointer" : "default" }}
              onClick={isMyProfile ? handleOpenEdit : undefined}
              title={isMyProfile ? "Change profile picture" : ""}
            >
              <img
                src={avatarUrl}
                alt="Profile"
                style={{
                  width: "130px", height: "130px",
                  borderRadius: "50%", objectFit: "cover",
                  border: "5px solid #141414",
                  backgroundColor: "#1c1c1c",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.5)"
                }}
              />
              {isMyProfile && (
                <div
                  style={{
                    position: "absolute", bottom: "6px", right: "6px",
                    backgroundColor: "#a855f7",
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "3px solid #141414",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.5)"
                  }}
                >
                  <FaCamera size={14} color="white" />
                </div>
              )}
            </div>

            <h3 className="fw-bold mb-1" style={{ letterSpacing: "-0.5px" }}>{profile.username}</h3>
            <p className="mb-3" style={{ color: "#a1a1aa", fontSize: "14px" }}>{profile.email}</p>

            <p className="mb-4 mx-auto" style={{ fontSize: "15px", color: "#e5e5e5", maxWidth: "90%", lineHeight: "1.6" }}>
              {profile.bio || "This user hasn't added a bio yet."}
            </p>

            <div className="d-flex justify-content-center pt-3 mb-2" style={{ borderTop: "1px solid #262626" }}>
               <div className="px-4 text-center">
                 <h4 className="mb-0 fw-bold" style={{ color: "white" }}>{posts.length}</h4>
                 <small style={{ color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "1px", fontSize: "12px", fontWeight: "600" }}>Posts</small>
               </div>
            </div>

            {isMyProfile && (
                <Button
                    className="mt-4 rounded-pill px-4 py-2"
                    style={{
                        fontWeight: "500",
                        backgroundColor: "transparent",
                        color: "white",
                        border: "1px solid #404040",
                        transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.color = "black";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "white";
                    }}
                    onClick={handleOpenEdit}
                >
                    <FaEdit className="me-2 mb-1" /> Edit Profile
                </Button>
            )}
          </Card.Body>
        </Card>

        {/* POSTS LISTING */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-5 pb-2" style={{ borderBottom: "1px solid #262626" }}>
            <h5 className="fw-bold mb-0" style={{ color: "white" }}>Published Posts</h5>
        </div>

        {posts.length === 0 ? (
            <div className="text-center mt-5 p-5" style={{ backgroundColor: "#141414", border: "1px solid #262626", borderRadius: "16px" }}>
                <p style={{ color: "#a1a1aa", fontSize: "16px", marginBottom: "0" }}>No posts found for {profile.username}.</p>
            </div>
        ) : (
            posts.map(post => (
                <Card key={post.id} className="mb-4" style={{ backgroundColor: "#141414", border: "1px solid #262626", color: "white", borderRadius: "14px" }}>
                    <Card.Body className="p-4">
                         {/* POST HEADER */}
                         <div className="d-flex align-items-center mb-3">
                            <img src={avatarUrl} alt="avatar" style={{width: '42px', height: '42px', borderRadius: '50%', objectFit: "cover", cursor: 'pointer'}} />
                            <div className="ms-3">
                                <h6 className="mb-0 fw-bold" style={{cursor: 'pointer', fontSize: "15px"}}>{profile.username}</h6>
                                <small style={{ color: "#a1a1aa", fontSize: "13px" }}>
                                  {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(post.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </small>
                            </div>
                        </div>

                        {/* POST CONTENT */}
                        <Card.Text style={{ fontSize: "15px", lineHeight: "1.6", color: "#e5e5e5", marginBottom: "16px" }}>
                            {post.content}
                        </Card.Text>

                        {/* POST IMAGE */}
                        {post.image_url && (
                          <div style={{ width: "100%", borderRadius: "10px", overflow: "hidden", marginBottom: "16px", border: "1px solid #262626" }}>
                            <img src={post.image_url} alt="post_img" style={{ width: "100%", height: "auto", display: "block" }} />
                          </div>
                        )}

                        {/* POST ACTIONS */}
                        <div className="d-flex align-items-center mt-2 pt-3" style={{ borderTop: "1px solid #262626" }}>
                            <div className="d-flex align-items-center me-4">
                                <span
                                    style={{ color: post.liked ? "#ec4899" : "#a1a1aa", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", transition: "color 0.2s" }}
                                    onClick={() => handleLike(post.id)}
                                    title="Toggle Like"
                                >
                                    <FaHeart />
                                </span>
                                <span style={{ marginLeft: "8px", color: "#a1a1aa", fontSize: "14px" }}>
                                    {post.likeCount || 0} likes
                                </span>
                            </div>

                            <div className="d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => navigate("/feed")}>
                                <span style={{ color: "#a1a1aa", fontSize: "18px", display: "flex", alignItems: "center" }}>
                                    <FaRegComment />
                                </span>
                                <span style={{ marginLeft: "8px", color: "#a1a1aa", fontSize: "14px" }}>
                                    View discussion in feed
                                </span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))
        )}
      </Container>

      {/* EDIT PROFILE MODAL */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered backdrop="static" keyboard={false}>
        <div style={{ backgroundColor: "#141414", border: "1px solid #333", borderRadius: "16px", color: "white", padding: "10px" }}>
            <Modal.Header closeButton className="border-0 pb-0" closeVariant="white">
              <Modal.Title className="fw-bold fs-5">Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className="mt-2">

                {/* PROFILE PICTURE SECTION */}
                <Form.Group className="mb-4 text-center">
                  <div
                    className="position-relative d-inline-block mb-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to change photo"
                  >
                    <img
                      src={previewUrl || avatarUrl}
                      alt="avatar preview"
                      style={{
                        width: "100px", height: "100px",
                        borderRadius: "50%", objectFit: "cover",
                        border: "4px solid #333",
                        backgroundColor: "#1c1c1c"
                      }}
                    />
                    {/* Camera hover overlay */}
                    <div
                      className="avatar-hover-overlay"
                      style={{
                        position: "absolute", inset: 0,
                        borderRadius: "50%",
                        backgroundColor: "rgba(0,0,0,0.50)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                      <FaCamera size={24} color="white" />
                    </div>
                  </div>

                  <Form.Label
                    style={{
                      display: "block",
                      color: "#a855f7",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      letterSpacing: "0.3px"
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? `✅ ${selectedFile.name}` : "📷 Choose a photo from your device"}
                  </Form.Label>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  <Form.Text style={{ color: "#737373", fontSize: "12px", display: "block", marginTop: "6px" }}>
                    Max 5MB • JPG, PNG, GIF, WEBP supported
                  </Form.Text>
                </Form.Group>

                {/* BIO */}
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#a1a1aa", fontSize: "14px", fontWeight: "600" }}>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    maxLength={500}
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "white", borderRadius: "8px", resize: "none" }}
                    placeholder="Tell us about yourself..."
                  />
                </Form.Group>

              </Form>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
              <Button
                variant="outline-secondary"
                onClick={() => setShowEdit(false)}
                style={{ borderRadius: "20px", padding: "6px 20px" }}
              >
                Cancel
              </Button>
              <Button
                style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)", border: "none", borderRadius: "20px", padding: "6px 20px", fontWeight: "500" }}
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Now"}
              </Button>
            </Modal.Footer>
        </div>
      </Modal>

    </div>
  );
}

export default Profile;
