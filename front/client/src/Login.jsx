// src/Login.jsx
import React, { useState } from "react";

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // === local UI state ===
  const [stage, setStage] = useState("face");     // "face" or "pin"
  const [user, setUser] = useState("");           // username for PIN fallback
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // === face login attempt ===
  async function tryFaceLogin() {
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/face`, { method: "GET" });
      if (res.ok) {
        const { user: faceUser } = await res.json();
        console.log("Welcome back", faceUser);
        // …navigate to your dashboard…
      } else {
        console.warn("Face not recognized, falling back to PIN");
        setStage("pin");
      }
    } catch (e) {
      console.error("Network or server error:", e);
      setError("Server error, try again later.");
    }
  }

  // === pin login form submit ===
  async function tryPinLogin(e) {
    e.preventDefault();
    setError("");
    if (!user || !pin) {
      setError("Please enter both username and PIN.");
      return;
    }
    try {
      const res = await fetch(`${API}/api/auth/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pin }),
      });
      if (res.ok) {
        console.log("PIN correct, welcome", user);
        // …navigate to your dashboard…
      } else {
        setError("Incorrect PIN, please try again.");
      }
    } catch (e) {
      console.error("Network or server error:", e);
      setError("Server error, try again later.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      {stage === "face" ? (
        <>
          <button onClick={tryFaceLogin}>🖼️ Login with Face</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <form onSubmit={tryPinLogin}>
          <p>Face not recognized. Please log in with your PIN:</p>
          <div>
            <label>
              Username{" "}
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="your username"
              />
            </label>
          </div>
          <div>
            <label>
              PIN{" "}
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="####"
              />
            </label>
          </div>
          <button type="submit">Submit PIN</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}
