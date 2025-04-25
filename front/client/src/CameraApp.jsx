// src/components/CameraPage.jsx
import React, { useRef, useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

export default function CameraPage() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

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
    navigate("/"); // or wherever your IdlePage is routed
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="time">Webcam Live View</div>
        <div className="date">Press "Esc" to Exit</div>
      </div>
      <hr className="login-divider" />
      <div className="camera-wrapper">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="camera-video"
          width="320"
          height="240"
        />
      </div>
      <button className="floating-button" onClick={handleBack}>
        ⬅ Back
      </button>
    </div>
  );
}
