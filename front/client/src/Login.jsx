import React, { useState, useEffect, useCallback, useRef } from "react"; 
import { useNavigate } from "react-router-dom"; 
import "./login.css";
import faceIdIcon from "./assets/faceIdIcon.png"

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null); // null = not counting
  const sleepTimer = 60*1000;// 1 minute timer
  const [incorrectPin, setIncorrectPin] = useState(0);
  const [incorrectPinLock, setIncorrectPinLock] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

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
    if (countdown === null || countdown <= 0) return;
  
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
  
    if (countdown === 1) {
      // Final second: trigger actual registration
      fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: user, user_key: pin }),
      })
        .then((res) => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (ok) {
            setSuccess("User registered successfully!");
            setUser("");
            setPin("");
            setStage("face");
          } else {
            setError(data.error || "Registration failed.");
          }
        })
        .catch(() => {
          setError("Registration error.");
        })
        .finally(() => setCountdown(null));
    }
  
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
  
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("User registered successfully!");
        setUser("");
        setPin("");
        stopWebcam();
        setStage("face");
      } else {
        setError(data.reason || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Could not connect to server.");
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
      <div className="login-header">
        <div className="time"><strong>{formattedTime}</strong></div>
        <div className="date">{formattedDate}</div>
      </div>

      <hr className="login-divider" />

      <div className="login-box">
        <h1>{getGreeting()}!</h1>
        <p>Welcome to the Smart Mirror</p>

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
          <input type="text" placeholder="New Username" value={user} onChange={e => setUser(e.target.value)} />
          <input type="password" placeholder="New PIN" value={pin} onChange={e => setPin(e.target.value)} />
          <button type="submit" className="login-button">Register with Face</button>
          <button type="button" onClick={() => {
            setStage("face");
            stopWebcam();
          }}>Back</button>
        </form>
        
        )}
        {incorrectPinLock > 0 && (
          <p className="error-text">Too many attempts. Try again in {incorrectPinLock} seconds.</p>
        )}
        {countdown !== null && (
          <p className="countdown-text">Taking picture in... {countdown}</p>
        )}
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </div>
    </div>
  );
}
