import React, { useRef, useEffect, useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import captureButton from "./assets/captureButton.png";

export default function CameraPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // stores the MediaStream so we can stop it
  const navigate = useNavigate();

  const [dateTime, setDateTime] = useState(new Date());
  const [userName] = useState("Messi"); // Replace with dynamic user info later
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(null);

  // Clock updater
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

  // Start webcam on mount
  useEffect(() => {
    startWebcam();
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Webcam access error:", err);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      console.log("[DEBUG] Stopping webcam tracks...");
      streamRef.current.getTracks().forEach((track) => {
        console.log(`[DEBUG] Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }
  
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      console.log("[DEBUG] Video srcObject cleared");
    }
  };
  

  const triggerBackendCapture = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Image captured: ${data.image_name}`);
      } else {
        setMessage(`${data.reason || "Capture failed"}`);
      }
    } catch (err) {
      console.error("Capture error:", err);
      setMessage("Could not connect to server.");
    }

    // Restart webcam after backend is done
    setTimeout(startWebcam, 1000);
  };

  const handleCountdownCapture = () => {
    let sec = 3;
    setCountdown(sec);

    const interval = setInterval(() => {
      sec -= 1;
      if (sec <= 0) {
        clearInterval(interval);
        setCountdown(null);
        stopWebcam(); // release webcam before backend captures
        setTimeout(() => {
            console.log("[DEBUG] Triggering backend capture...");
            triggerBackendCapture();
        }, 1500); // wait 1.5 seconds
      } else {
        setCountdown(sec);
      }
    }, 1000);
  };

  const handleBack = () => {
    stopWebcam();
    navigate("/");
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

      {/* Countdown UI */}
      {countdown !== null && (
        <div style={{ fontSize: "72px", color: "white", marginTop: "20px" }}>
          {countdown}
        </div>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button className="floating-button" onClick={handleCountdownCapture}>
          <img src={captureButton} alt="Capture" className="button-image" />
        </button>
        {message && <p style={{ marginTop: "10px", color: "white" }}>{message}</p>}
      </div>
    </div>
  );
}
