import React, { useState, useEffect } from 'react';

const DateTime = () => {
  const [date, setDate] = useState(new Date());
  const [user, setUser] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    setUser(sessionStorage.getItem('user') || '');
    return () => clearInterval(timer);
  }, []);

  const formatDate = (dateObj) => {
    const day = dateObj.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'ST'
        : day === 2 || day === 22
        ? 'ND'
        : day === 3 || day === 23
        ? 'RD'
        : 'TH';

    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${month} ${day}${suffix}`;
  };

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
          color: 'white',
          fontSize: '40px',
          fontWeight: '400',
          width: '100%',
          boxSizing: 'border-box',
          borderBottom: '1px solid #fff'
        }}
      >
        <span>{time}</span>
        <span>{formatDate(date)}</span>
        
      </div>
        {user && (
        <div
          style={{
            color: 'white',
            fontSize: '35px',
            fontWeight: '400',
            textAlign: 'left',
            margin: '6px',
          }}
        >
          Hello, {user}!
        </div>
        )}
    </div>
  );
};

export default DateTime;
