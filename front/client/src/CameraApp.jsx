// src/components/CameraPage.jsx
import React, { useRef, useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

export default function CameraPage() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
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
    </div>
  );
}
