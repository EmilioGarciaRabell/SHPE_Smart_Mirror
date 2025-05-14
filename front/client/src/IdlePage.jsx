import React, { useState, useEffect } from "react";
import "./login.css";
import DateTime from './components/DateTime';
import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

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
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: '90%',
          }}
        >
          <DateTime />
        </div>
      </div>
      <button className="floating-button" onClick={loginButtonClick}>
        <FaSignInAlt size={48} color="white" />
      </button>
    </div>
  );
}
