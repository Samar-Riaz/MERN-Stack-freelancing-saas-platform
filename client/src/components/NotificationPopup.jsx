import React, { useEffect } from 'react';

const NotificationPopup = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      background: '#fff',
      color: '#222',
      border: '1px solid #007bff',
      borderRadius: 8,
      boxShadow: '0 2px 12px #007bff33',
      padding: '18px 32px',
      zIndex: 9999,
      fontWeight: 600,
      fontSize: 16
    }}>
      {message}
      <button style={{ marginLeft: 24, background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 700 }} onClick={onClose}>×</button>
    </div>
  );
};

export default NotificationPopup;
