const Navbar = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={{
      padding: "10px 20px",
      borderBottom: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <h3 style={{ margin: 0 }}>SocialApp</h3>

      <button
        onClick={handleLogout}
        style={{
          padding: "6px 12px",
          border: "none",
          borderRadius: "5px",
          backgroundColor: "#ff4d4f",
          color: "white",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;