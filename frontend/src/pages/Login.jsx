import { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api"; // unified api wrapper

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorVisible("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorVisible(false);

    try {
      const data = await loginUser({ email, password });
      
      // Save data locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("userId", data.id);

      // Programmatic routing avoiding page reload
      navigate("/feed");

    } catch (err) {
      console.log(err);
      setErrorVisible(err.response?.data?.message || "Login failed ❌. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="shadow p-4 border-0 rounded-4">
        <h3 className="text-center mb-4 text-primary fw-bold">Welcome Back</h3>
        
        {errorVisible && (
          <Alert variant="danger" onClose={() => setErrorVisible(false)} dismissible>
            {errorVisible}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted fw-semibold mb-1">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-muted fw-semibold mb-1">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2"
            />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100 py-2 fw-bold text-uppercase rounded-3 mb-3 d-flex justify-content-center align-items-center"
            style={{ gap: '10px' }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <p className="text-center mt-3 text-muted">
          Don't have an account?{" "}
          <span
            className="text-primary fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </Card>
    </Container>
  );
}

export default Login;