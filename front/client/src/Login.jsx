import React, { useState, useEffect, useCallback, useRef } from "react"; 
import { useNavigate } from "react-router-dom"; 
import "./login.css";
//import "./App.css";
import faceIdIcon from "./assets/faceIdIcon.png"
import DateTime from './components/DateTime';

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null); // null = not counting
  const sleepTimer = 5*60*1000;// 5 minute timer
  const [incorrectPin, setIncorrectPin] = useState(0);
  const [incorrectPinLock, setIncorrectPinLock] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        console.log("Available media devices:");
        devices.forEach((d) => console.log(`${d.kind}: ${d.label || "(no label)"} - ${d.deviceId}`));
      });
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
      setError("Could not access webcam. Please check camera connection and permissions.");
    }
  };
  
  
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  
  const resetSleepTimer = useCallback(() => {
    clearTimeout(window._idleTimer);
    window._idleTimer = setTimeout(() => {
      console.log("User has not tried to login within 5 minutes, now sleeping.");
      navigate("/");
    }, sleepTimer);
  }, [navigate]);

  useEffect(() => {
    if(incorrectPinLock <= 0) return;
    const timer = setInterval(() => {
      setIncorrectPinLock(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIncorrectPin(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [incorrectPinLock]);


  useEffect(() => {
    resetSleepTimer();
    const activity = ["mousemove", "keydown", "touchstart", "touchmove"];
    activity.forEach(evt => document.addEventListener(evt, resetSleepTimer));
    return () => {
      activity.forEach(evt => document.addEventListener(evt, resetSleepTimer));
      clearTimeout(window._idleTimer);
    };
  }, [resetSleepTimer]);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      setCountdown(null);
      return;
    }
  
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, [countdown]);
  

  const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = dateTime.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const [stage, setStage] = useState("face");
  const [user, setUser] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function tryFaceLogin() {
    setError("");
    setIsScanning(true);  //Show scanning indicator
    try {
      const res = await fetch(`${API}/api/auth/face`, { method: "GET" });
      if (res.ok) {
        const { user: faceUser } = await res.json();
        sessionStorage.setItem('user', faceUser);
        console.log("Welcome back", faceUser);
        navigate("/main");
      } else {
        console.warn("Face not recognized, falling back to PIN");
        setStage("pin");
        setUser("");
        setPin("");
      }
      
    } catch (e) {
      console.error("Network or server error:", e);
      setError("Server error, try again later.");
    } finally {
      setIsScanning(false);  //Hide scanning indicator
    }
  }
  

  async function tryPinLogin(e) {
    e.preventDefault();
    setError("");
    if (!user || !pin) {
      setError("Please enter both username and PIN.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pin }),
      });
      if (res.ok) {
        console.log("PIN correct, welcome", user);
        sessionStorage.setItem('user', user);
        setIncorrectPin(0);
        navigate("/main");
      } else {
        const newPinTries = incorrectPin + 1;
        setIncorrectPin(newPinTries);
        if(newPinTries >= 3){
          setIncorrectPinLock(30);
          setError("Too many pin attempts, wait 30 seconds!");
          setTimeout(() => {
            setStage("face");
            setUser("");
            setPin("");
            setIncorrectPin(0);
            setIncorrectPinLock(0);
            navigate("/");
          }, 30 * 1000);
        }else{
          setError("Incorrect PIN, please try again.");
        }
      }
    } catch (e) {
      console.error("Network or server error:", e);
      setError("Server error, try again later.");
    }finally{
      setIsLoading(false);
    }
  }

  async function tryRegisterUser(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!user || !pin) {
      setError("Please enter both username and PIN.");
      return;
    }
  
    if (!videoRef.current || videoRef.current.readyState < 2) {
      setError("Camera not ready. Please wait a moment.");
      return;
    }
  
    setIsLoading(true);
  
    let sec = 3;
    setCountdown(sec);
  
    const countdownInterval = setInterval(() => {
      sec -= 1;
      setCountdown(sec);
      if (sec <= 0) {
        clearInterval(countdownInterval);
        captureAndSendRegistration();
      }
    }, 1000);
  }
  
  
  async function captureAndSendRegistration() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL("image/jpeg");
  
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: user,
          user_key: pin,
          image: base64Image,
        }),
      });
  
      if (!res.ok) {
        // If server responds with error, handle it without trying to parse bad JSON
        throw new Error("Registration request failed with status " + res.status);
      }
  
      const data = await res.json();
  
      if (data.success) {
        setSuccess("User registered successfully!");
        setError("")
        setUser("");
        setPin("");
        stopWebcam();
        setTimeout(() => {
          setSuccess("");
          setStage("face");
        }, 1500);
      } else {
        setError(data.reason || "Registration failed.");
        setSuccess("")
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Could not connect to server or registration failed.");
      setSuccess("")
    } finally {
      setIsLoading(false);
      setCountdown(null);
    }
  }
  
  

  function getGreeting() {
    const hour = dateTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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

      <div className="login-box">
        <h1>{getGreeting()}!</h1>
        <h3>Welcome to the Smart Mirror</h3>

        {stage === "face" && (
          isScanning ? (
            <div className="scanning-box">
              <img src={faceIdIcon} alt="Scanning Face" className="scanning-icon" />
              <p className="scanning-text">Scanning for Face...</p>
            </div>
          ) : (
            <>
              <button className="login-button" onClick={tryFaceLogin}>Login with Face</button>
              <button className="login-button" onClick={() => {
                  setStage("register");
                  setError("");
                  setSuccess("");
                  startWebcam();
                }}> Register New User
              </button>
            </>
          )
        )}



        {stage === "pin" && (
          <form onSubmit={tryPinLogin}>
            <input type="text" placeholder="Username" value={user} onChange={e => setUser(e.target.value)} disabled={incorrectPinLock > 0}/>
            <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} disabled={incorrectPinLock > 0}/>
            <button type="submit" disabled={incorrectPinLock > 0 || isLoading} className="login-button">
              {isLoading ? <div className="spinner"></div> : "Login with PIN"}
            </button>
            <button type="button" disabled={incorrectPinLock > 0} onClick={() => setStage("face")}>Back</button>
          </form>
        )}

        {stage === "register" && (
          <form onSubmit={tryRegisterUser}>
            <div className="camera-wrapper" style={{ position: "relative" }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="camera-video"
                width="320"
                height="240"
              />
              <div className="face-guide-overlay"></div>
            </div>
            
            <input
              type="text"
              placeholder="New Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="New PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={isLoading}
            />

            {countdown !== null ? (
              <p className="countdown-text">Taking picture in... {countdown}</p>
            ) : (
              <button type="submit" disabled={isLoading} className="login-button">
                {isLoading ? <div className="spinner"></div> : "Register with Face"}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setStage("face");
                setError("");
                setSuccess("");
                stopWebcam();
              }}
              disabled={isLoading}
            >
              Back
            </button>
          </form>
        )}

        {incorrectPinLock > 0 && (
          <p className="error-text">Too many attempts. Try again in {incorrectPinLock} seconds.</p>
        )}
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </div>
    </div>
  );
}
