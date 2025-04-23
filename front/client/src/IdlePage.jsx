// src/IdlePage.jsx
import React, { useState, useEffect } from "react";
import "./login.css";

export default function IdlePage() {
  const [dateTime, setDateTime] = useState(new Date());

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

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="time">{formattedTime}</div>
        <div className="date">{formattedDate}</div>
      </div>
    </div>
  );
}
