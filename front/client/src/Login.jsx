import React, { useRef, useEffect, useState } from 'react';

export default function LoginPage() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('');

  // Open local camera for preview only
  useEffect(() => {
    async function startPreview() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Camera preview failed:', err);
        setStatus('⚠️ Cannot open camera preview');
      }
    }
    startPreview();

    // Cleanup on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Trigger backend face-rec login
  const handleLogin = async () => {
    setStatus('Authenticating…');
    try {
      const resp = await fetch('/api/login', { method: 'POST' });
      if (resp.ok) {
        setStatus('Welcome back!');
      } else {
        setStatus('Access Denied');
      }
    } catch (e) {
      console.error('Login request failed:', e);
      setStatus('Network error');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Face Recognition Login</h1>
      <video
        ref={videoRef}
        width={640}
        height={480}
        autoPlay
        muted
        style={{ border: '1px solid #666', marginBottom: '1rem' }}
      />
      <br />
      <button onClick={handleLogin} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        Login with Face
      </button>
      <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>{status}</p>
    </div>
  );
}
