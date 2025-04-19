// src/Login.jsx
import { useState } from "react";

export default function Login() {
  const [stage, setStage] = useState("face");    // "face" → try face, then "pin"
  const [user,  setUser]  = useState("");
  const [pin,   setPin]   = useState("");
  const API = import.meta.env.VITE_API_URL || "http://rpi4b.student.rit.edu:5000";

  async function tryFaceLogin() {
    const res = await fetch(`${API}/api/auth/face`, {
      method: "POST",
    });
    if (res.ok) {
      const { user } = await res.json();
      console.log("Welcome back", user);
      // …navigate to dashboard…
    } else {
      console.log("Face not recognized, falling back to PIN");
      promptForPin();
    }
  }

  async function checkPin(user, pin) {
    const res = await fetch(`${API}/api/auth/pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pin }),
    });
    if (res.ok) {
      console.log("PIN correct, welcome", user);
      // …navigate…
    } else {
      console.error("Bad PIN");
      // …show error…
    }
  }

  return (
    <div style={{ padding: 20 }}>
      {stage === "face" ? (
        <button onClick={tryFaceLogin}>
          🖼️ Login with Face
        </button>
      ) : (
        <form onSubmit={tryPinLogin}>
          <p>Face not recognized. Enter PIN for <b>{user}</b>:</p>
          <input
            type="password"
            value={pin}
            onChange={e => checkPin(e.target.value)}
          />
          <button type="submit">Submit PIN</button>
        </form>
      )}
    </div>
  );
}
