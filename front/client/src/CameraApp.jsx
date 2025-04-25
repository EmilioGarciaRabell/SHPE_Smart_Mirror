// src/components/CameraPage.jsx
import React, { useRef, useEffect, useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import captureButton from "./assets/captureButton.png";

export default function CameraPage() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(new Date());
  const [userName] = useState("Messi"); // Set from login or context in future
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam access error:", err);
      }
    }
    startCamera();
  }, []);

  const handleBack = () => {
    navigate("/"); 
  };

    const takePicture = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_name: userName }),
      });
      const data = await res.json();
        if (data.success) {
          setMessage(`Image captured: ${data.image_name}`);
        } else {
          setMessage(`${data.reason || "Capture failed"}`);
        }
    } catch (err) {
      console.error("Capture error:", err);
      setMessage("Could not connect to server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="time">{formattedTime}</div>
        <div className="date">{formattedDate}</div>
      </div>
      <hr className="login-divider" />
      <div className="camera-wrapper">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="camera-video"
          width="640"
          height="480"
        />
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button className="floating-button" onClick={takePicture}>
            <img src={captureButton} className="button_image"/>
        </button>
        {message && <p style={{ marginTop: "10px", color: "white" }}>{message}</p>}
      </div>
    </div>
  );
}
