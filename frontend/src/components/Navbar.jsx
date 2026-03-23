import { Navbar, Container } from "react-bootstrap";

const AppNavbar = () => {

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Navbar
      style={{
        backgroundColor: "#0d0d0d",
        borderBottom: "1px solid #262626",
        padding: "12px 0",
      }}
      sticky="top"
    >
      <Container className="d-flex justify-content-between align-items-center">

        {/* LOGO */}
        <div
          style={{
            fontWeight: "bold",
            fontSize: "25px",
            background: "linear-gradient(90deg,#a855f7,#ec4899)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/feed")}
        >
          Noctra
        </div>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-3">

          {/* CREATE BUTTON */}
          <button
            onClick={() => (window.location.href = "/create")}
            style={{
              border: "none",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "linear-gradient(90deg,#a855f7,#ec4899)",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            + Post
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            style={{
              border: "1px solid #333",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "transparent",
              color: "#e5e5e5",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>

        </div>

      </Container>
    </Navbar>
  );
};

export default AppNavbar;