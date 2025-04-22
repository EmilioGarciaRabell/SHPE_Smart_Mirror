import React from 'react';
import { FaChevronLeft } from 'react-icons/fa'; // looks like <


function PanelWrapper({ title, onClose, children }) {
  return (
    <div style={{
      width: '280px',
      maxHeight: '420px',
      margin: '10px',
      backgroundColor: '#2c2c2c',
      borderRadius: '12px',
      padding: '15px',
      boxShadow: '0 0 8px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#aaa',
            fontSize: '18px',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <FaChevronLeft />
        </button>
        <h1 style={{ fontSize: '16px', margin: 0 }}>{title}</h1>
      </div>

      <hr style={{ border: '1px solid #444', marginBottom: '10px' }} />

      {children}
    </div>
  );
}

export default PanelWrapper;
