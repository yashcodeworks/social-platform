import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("userId", data.id);

      alert("Login Success ✅");
      window.location.href = "/feed";

    } catch (err) {
      console.log(err);
      alert("Login failed ❌");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="shadow p-4">
        <h3 className="text-center mb-3">Login</h3>

        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100"
            onClick={handleLogin}
          >
            Login
          </Button>
        </Form>

        <p className="text-center mt-3">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </Card>
    </Container>
  );
}

export default Login;