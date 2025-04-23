// src/IdlePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./login.css";
import loginKey from "./assets/LoginKeyFinal.png";
import { useNavigate } from "react-router-dom";

export default function IdlePage() {
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = dateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = dateTime.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  function loginButtonClick() {
    navigate("/login");
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="time">{formattedTime}</div>
        <div className="date">{formattedDate}</div>
      </div>
      <hr className="login-divider" />
      <button className="floating-button" onClick={loginButtonClick}>
        <img src={loginKey} alt="Login?" className="button-image" />
      </button>
    </div>
  );
}
