import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AdminMessagesSidebar from '../components/AdminMessagesSidebar';
import ChatBox from '../components/ChatBox';
import API from '../api';

const AdminMessages = () => {
  const { userId: paramUserId } = useParams();
  const location = useLocation();
  const [selectedUserId, setSelectedUserId] = useState(paramUserId || null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [prefill, setPrefill] = useState('');

  // If redirected after accepting a bid, prefill message
  useEffect(() => {
    if (location.state && location.state.acceptedUserId) {
      const id = typeof location.state.acceptedUserId === 'object'
        ? location.state.acceptedUserId._id
        : location.state.acceptedUserId;
      setSelectedUserId(id);
      setPrefill('Hey! Your bid has been accepted');
    }
  }, [location.state]);

  // Fetch selected user details
  useEffect(() => {
    if (!selectedUserId) return;
    API.getUserProfile(selectedUserId).then(res => setSelectedUser(res.data)).catch(() => setSelectedUser(null));
  }, [selectedUserId]);

  // Helper to get consistent room name
  function getRoomName(adminId, userId) {
    return [adminId, userId].sort().join('_');
  }

  // Use real admin and client IDs
  const ADMIN_ID = '68768b642139024e0f854d8e';

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      <AdminMessagesSidebar onSelect={setSelectedUserId} selectedUserId={selectedUserId} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #eee', background: '#f9f9f9', minHeight: 60 }}>
          {selectedUser ? (
            <>
              <b>Chat with: {selectedUser.name}</b>
            </>
          ) : (
            <span>Select a client to start chatting</span>
          )}
        </div>
        <div style={{ flex: 1, padding: 16 }}>
          {selectedUserId ? (
            <ChatBox
              room={getRoomName(ADMIN_ID, selectedUserId?.toString())}
              user={ADMIN_ID}
              peer={selectedUserId?.toString()}
              prefill={prefill}
              onPrefillUsed={() => setPrefill('')}
            />
          ) : (
            <div style={{ color: '#888', marginTop: 40 }}>No conversation selected.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
