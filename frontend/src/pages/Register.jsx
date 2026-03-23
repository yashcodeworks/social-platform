import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      if (!username || !email || !password) {
        alert("All fields required ❗");
        return;
      }

      await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      alert("Signup Success 🎉");

      window.location.href = "/"; // 🔥 login page

    } catch (err) {
      console.log(err);
      alert("Signup failed ❌");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="shadow p-4">
        
        <h3 className="text-center mb-3">Register</h3>

        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="success"
            className="w-100"
            onClick={handleRegister}
          >
            Register
          </Button>
        </Form>

        {/* 🔥 LOGIN LINK BELOW */}
        <p className="text-center mt-3">
          Already have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>

      </Card>
    </Container>
  );
}

export default Register;