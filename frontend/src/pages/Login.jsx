import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:8080/auth/login", {
      email,
      password,
    });

    
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.id);
    localStorage.setItem("email", res.data.email);

    alert("Login Success 🚀");

    window.location.href = "/feed";

  } catch (err) {
    alert("Invalid credentials ❌");
  }
};

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        Don't have an account?{" "}
        <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;