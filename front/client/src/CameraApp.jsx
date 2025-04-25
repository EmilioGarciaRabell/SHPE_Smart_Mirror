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

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      console.log("Available media devices:");
      devices.forEach((d) => console.log(`${d.kind}: ${d.label || "(no label)"} - ${d.deviceId}`));
    });
  }, []);
  

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
      if (!videoRef.current) {
        console.error("Video element not available.");
        return;
      }
  
      // Create canvas to capture frame
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
      // Convert canvas to base64-encoded JPEG
      const base64Image = canvas.toDataURL("image/jpeg");
  
      // Send image to backend
      const res = await fetch("http://localhost:5000/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName,
          image: base64Image,
        }),
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
  
    // Restart webcam after backend is done
    setTimeout(startWebcam, 500);
  };

  const handleCountdownCapture = () => {
    let sec = 3;
    setCountdown(sec);
  
    const interval = setInterval(() => {
      sec -= 1;
      if (sec <= 0) {
        clearInterval(interval);
        setCountdown(null);
        stopWebcam(); // release webcam
        console.log("[DEBUG] Webcam stream stopped. Waiting before backend call...");
  
        // wait 2 full seconds before triggering backend
        setTimeout(() => {
          console.log("[DEBUG] Triggering backend capture...");
          triggerBackendCapture();
        }, 2000);
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
          width="480"
          height="360"
        />
      </div>

      {/* Countdown UI */}
      {countdown !== null && (
        <div style={{ fontSize: "72px", color: "white", marginTop: "20px" }}>
          {countdown}
        </div>
      )}
        <div className="capture-button-wrapper">
            <button className="floating-button" onClick={handleCountdownCapture}>
                <img src={captureButton} alt="Capture" className="button-image" />
            </button>
        </div>
        {message && <p className="capture-message">{message}</p>}
        </div>
  );
}
