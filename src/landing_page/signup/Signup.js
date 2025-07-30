import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ← Add navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Simple validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to dashboard on successful signup
        window.location.href = "http://localhost:3000";
      } else {
        // Redirect to login if user already exists (adjust condition if needed)
        if (data.message && data.message.toLowerCase().includes("already exists")) {
          setMessage("User already exists, redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000); // 2 seconds delay to show message before redirect
        } else {
          setError(data.message || "Signup failed.");
        }
      }
    } catch (err) {
      setError("Network error or server is down.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: 300, margin: "auto" }}>
      <h2>Sign Up</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {message && <div style={{ color: "green" }}>{message}</div>}

      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignupForm;
