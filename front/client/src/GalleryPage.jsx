import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import captureButton from "./assets/captureButton.png";
import homeButton from "./assets/homebutton.png";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const user = sessionStorage.getItem("user")
  const [userName] = useState(user);
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name: userName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setImages(data.images);
      });
  }, [userName]);

  const formattedTime = dateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = dateTime.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCamera = () => {
    navigate("/camera");
  };

  const handleHome = () => {
    navigate("/main");
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="time">{formattedTime}</div>
        <div className="date">{formattedDate}</div>
      </div>
      <hr className="login-divider" />
      <div className="camera-wrapper" style={{ overflowY: "scroll", maxHeight: "65vh", padding: "10px" }}>
        {images.length > 0 ? (
          <div className="gallery-grid">
            {images.map((src, i) => (
              <img
                key={i}
                src={`http://localhost:5000${src}?t=${new Date().getTime()}`}
                alt={`Image ${i}`}
                className="gallery-img"
                onClick={() => setSelectedImage(`http://localhost:5000${src}?t=${new Date().getTime()}`)}
            />
            ))}
          </div>
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>No images found.</p>
        )}
      </div>
      <button className="floating-button" onClick={handleCamera}>
          <img src={captureButton} alt="Capture" className="button-image" />
      </button>
      <button className="home-button" onClick={handleHome}>
          <img src={homeButton} alt="Go Home"/>
      </button>
    </div>
  );
}
