import React, { useRef, useEffect, useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import captureButton from "./assets/captureButton.png";
import homeButton from "./assets/homebutton.png";

export default function CameraPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // stores the MediaStream so we can stop it
  const navigate = useNavigate()
  const user = sessionStorage.getItem('user')
  const [dateTime, setDateTime] = useState(new Date());
  const [userName] = useState(user); // Replace with dynamic user info later
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      console.log("Available media devices:");
      devices.forEach((d) => console.log(`${d.kind}: ${d.label || "(no label)"} - ${d.deviceId}`));
    });
  }, []);
  

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timeout);
    }
  }, [message]);
  
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
  
      if (videoRef.current.readyState < 2) {
        console.error("Video not ready to capture frame!");
        setMessage("Camera not ready yet, please try again!");
        return;
      }
  
      //Pause the video during capture
      videoRef.current.pause();
  
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
      const base64Image = canvas.toDataURL("image/jpeg");
      console.log("Generated base64 image length:", base64Image.length);
  
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
    } finally {
      if (videoRef.current) {
        videoRef.current.play();  //Resume the webcam after capture
        console.log("[DEBUG] Webcam resumed after capture.");
      }
    }
  };
  
  

  const handleCountdownCapture = () => {
    let sec = 3;
    setCountdown(sec);
  
    const interval = setInterval(() => {
      sec -= 1;
      if (sec <= 0) {
        clearInterval(interval);
        setCountdown(null);
  
        console.log("[DEBUG] Triggering backend capture...");
        triggerBackendCapture();
  
      } else {
        setCountdown(sec);
      }
    }, 1000);
  };
  
  
  

  const handleBack = () => {
    stopWebcam();
    navigate("/main");
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
            <button className="floating-button" onClick={handleCountdownCapture}>
                <img src={captureButton} alt="Capture" className="button-image" />
            </button>
        {message && <p className="capture-message">{message}</p>}

      <button className="floating-button" onClick={handleBack}>
        <img src={homeButton} alt="Go Home"/>
      </button>
      
    </div>
  );
}
