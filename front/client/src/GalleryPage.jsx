import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [userName] = useState("Antonios"); //change this for later
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

  const handleBack = () => {
    navigate("/camera");
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
                src={`http://localhost:5000${src}`}
                alt={`Image ${i}`}
                className="gallery-img"
              />
            ))}
          </div>
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>No images found.</p>
        )}
      </div>
      <div className="capture-button-wrapper">
        <button className="floating-button" onClick={handleBack}>
          ⬅
        </button>
      </div>
    </div>
  );
}
