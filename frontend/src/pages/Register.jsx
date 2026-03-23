import { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      // 🔥 validation
      if (!username || !email || !password) {
        alert("All fields are required ❗");
        return;
      }

      await axios.post("http://localhost:8080/api/users", {
        username,
        email,
        password,
      });

      alert("Signup Success 🎉");

      // 🔥 redirect to login page
      window.location.href = "/";

    } catch (err) {
      console.log(err);
      alert("Signup failed ❌ (maybe email already exists)");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

export default Register;