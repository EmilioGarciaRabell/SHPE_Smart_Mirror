import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 

import "./login.css";

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = dateTime.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const [stage, setStage] = useState("face");
  const [user, setUser] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function tryFaceLogin() {
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/face`, { method: "GET" });
      if (res.ok) {
        const { user: faceUser } = await res.json();
        console.log("Welcome back", faceUser);
        navigate("/main");
      } else {
        console.warn("Face not recognized, falling back to PIN");
        setStage("pin");
      }
    } catch (e) {
      console.error("Network or server error:", e);
      setError("Server error, try again later.");
    }
  }

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
        navigate("/main");
      } else {
        setError("Incorrect PIN, please try again.");
      }
    } catch (e) {
      console.error("Network or server error:", e);
      setError("Server error, try again later.");
    }
  }

  function getGreeting() {
    const hour = dateTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="login-container">
  <div className="login-header">
    <div className="time"><strong>{formattedTime}</strong></div>
    <div className="date">{formattedDate}</div>
  </div>

  <hr className="login-divider" />

  <div className="login-box">
    {stage === "face" ? (
      <>
        <h1>{getGreeting()}!</h1>
        <p>Welcome to the Smart Mirror</p>
        <button className="login-button" onClick={tryFaceLogin}>
          Login with Face
        </button>
      </>
    ) : (
      <>
        <h1>PIN Login</h1>
        <p>Face not recognized. Please enter your credentials:</p>
        <form onSubmit={tryPinLogin} className="pin-form">
          <input
            type="text"
            placeholder="Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="login-input"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login with PIN
          </button>
        </form>
      </>
    )}
  </div>
</div>

  

  );
}
