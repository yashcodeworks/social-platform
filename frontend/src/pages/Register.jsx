import { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./api"; // unified api wrapper

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setErrorVisible("All fields are required ❗");
      return;
    }

    if (password.length < 6) {
        setErrorVisible("Password must be at least 6 characters.");
        return;
    }

    setLoading(true);
    setErrorVisible(false);

    try {
      const data = await registerUser({ username, email, password });

      // Automatically log the user in since the backend returns a JWT response payload
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("userId", data.id);

      navigate("/feed"); // Route directly to feed instead of prompting login

    } catch (err) {
      console.log(err);
      setErrorVisible(err.response?.data?.message || "Signup failed ❌. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="shadow p-4 border-0 rounded-4">
        
        <h3 className="text-center mb-4 text-success fw-bold">Create Account</h3>
        
        {errorVisible && (
          <Alert variant="danger" onClose={() => setErrorVisible(false)} dismissible>
            {errorVisible}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted fw-semibold mb-1">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Pick a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
             <Form.Label className="text-muted fw-semibold mb-1">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4">
             <Form.Label className="text-muted fw-semibold mb-1">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2"
            />
          </Form.Group>

          <Button
            variant="success"
            className="w-100 py-2 fw-bold text-uppercase rounded-3 mb-3 d-flex justify-content-center align-items-center"
            style={{ gap: '10px' }}
            onClick={handleRegister}
            disabled={loading}
          >
             {loading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
             {loading ? "Creating Account..." : "Register"}
          </Button>
        </Form>

        <p className="text-center mt-3 text-muted">
          Already have an account?{" "}
          <span
            className="text-primary fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </Card>
    </Container>
  );
}

export default Register;