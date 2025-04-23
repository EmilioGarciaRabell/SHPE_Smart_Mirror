import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';

function PanelWrapper({ title, onClose, icon, children }) {
  return (
    <div style={{
      width: '400px',
      margin: '10px',
      backgroundColor: '#2c2c2c',
      borderRadius: '12px',
      padding: '15px',
      boxShadow: '0 0 8px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#aaa',
            fontSize: '28px',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <FaChevronLeft />
        </button>

        <h1 style={{
          fontSize: '26px',
          margin: 0,
          color: 'white',
          flexGrow: 1,
          textAlign: 'left',
          marginLeft: '10px'
        }}>
          {title}
        </h1>

        {icon && (
          <div style={{ fontSize: '30px', color: '#aaa' }}>
            {icon}
          </div>
        )}
      </div>

      <hr style={{ border: '1px solid #444', marginBottom: '10px' }} />

      {children}
    </div>
  );
}

export default PanelWrapper;
