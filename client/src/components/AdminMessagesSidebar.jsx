import React, { useEffect, useState } from 'react';
import API from '../api';

const AdminMessagesSidebar = ({ onSelect, selectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.getMessages({ conversations: true });
        setUsers(res.data);
      } catch {
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div style={{ width: 240, borderRight: '1px solid #eee', height: '100%', overflowY: 'auto', background: '#fafbfc' }}>
      <h4 style={{ padding: 16, margin: 0, borderBottom: '1px solid #eee' }}>Clients</h4>
      {loading ? <div style={{ padding: 16 }}>Loading...</div> :
        error ? <div style={{ color: 'red', padding: 16 }}>{error}</div> :
        users.length === 0 ? <div style={{ padding: 16 }}>No conversations</div> :
        users.map(u => {
          // If u is a string (userId), render as 'User: [id]'. If object, render name or id.
          const id = typeof u === 'string' ? u : u._id;
          const label = typeof u === 'string' ? `User: ${u.substring(0, 6)}...` : (u.name || id);
          return (
            <div
              key={id}
              onClick={() => onSelect(id)}
              style={{
                padding: '12px 16px',
                background: (selectedUserId === id) ? '#e6f0ff' : 'transparent',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                fontWeight: 500
              }}
            >
              {label}
            </div>
          );
        })
      }
    </div>
  );
};

export default AdminMessagesSidebar;
