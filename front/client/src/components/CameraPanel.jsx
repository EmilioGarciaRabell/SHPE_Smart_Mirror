import React, { useRef, useEffect } from 'react';
import PanelWrapper from './PanelWrapper';
import { useNavigate } from "react-router-dom"; 
import { FaCamera } from 'react-icons/fa';

const CameraPanel = ({ onClose }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Webcam access error:', err);
      }
    };

    startWebcam();

    return () => {
      // Stop all tracks for security
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <PanelWrapper title="Camera" icon={<FaCamera
      onClick={() => navigate('/camera')}
      style={{ cursor: 'pointer' }}
    />} onClose={onClose}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          maxHeight: '300px',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />
    </PanelWrapper>
  );
};

export default CameraPanel;
