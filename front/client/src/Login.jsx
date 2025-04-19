// src/Login.jsx
import { useState } from "react";

export default function Login() {
  const [stage, setStage] = useState("face");    // "face" → try face, then "pin"
  const [user,  setUser]  = useState("");
  const [pin,   setPin]   = useState("");

  async function tryFaceLogin() {
    const res  = await fetch("/api/auth/face", { method: "POST" });
    const body = await res.json();
    if (body.success) {
      alert(` Welcome ${body.user}!`);
      // TODO: redirect to your protected page...
    } else {
      setUser(body.user || "");
      setStage("pin");
    }
  }

  async function tryPinLogin(e) {
    e.preventDefault();
    const res  = await fetch("/api/auth/pin", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ user, pin }),
    });
    const body = await res.json();
    if (body.success) {
      alert(`✅ Welcome ${user}!`);
      // TODO: redirect...
    } else {
      alert(" Wrong PIN, try again");
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
            onChange={e => setPin(e.target.value)}
          />
          <button type="submit">Submit PIN</button>
        </form>
      )}
    </div>
  );
}
