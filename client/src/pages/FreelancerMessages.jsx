import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ChatBox from '../components/ChatBox';
import API from '../api';

const FreelancerMessages = () => {
  const { conversationId: paramConversationId } = useParams();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(paramConversationId || null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Fetch conversations (admin ids)
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await API.getMessages({ conversations: true });
        setConversations(res.data);
      } catch {
        setConversations([]);
      }
    };
    fetchConvos();
  }, []);

  // Fetch selected user (admin) details if needed
  useEffect(() => {
    if (!selectedId) return setSelectedUser(null);
    // For this app, admin is always the peer
    setSelectedUser({ _id: 'admin', name: 'Admin' });
  }, [selectedId]);

  // If route param changes, update selectedId
  useEffect(() => {
    if (paramConversationId) setSelectedId(paramConversationId);
  }, [paramConversationId]);

  // Helper to get consistent room name
  function getRoomName(adminId, userId) {
    return [adminId, userId].sort().join('_');
  }

  // Use real admin ID
  const ADMIN_ID = '68768b642139024e0f854d8e';

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      {/* Sidebar */}
      <div style={{ width: 240, borderRight: '1px solid #eee', height: '100%', overflowY: 'auto', background: '#fafbfc' }}>
        <h4 style={{ padding: 16, margin: 0, borderBottom: '1px solid #eee' }}>Admin</h4>
        {conversations.length === 0 ? (
          <div style={{ padding: 16 }}>No conversations</div>
        ) : (
          <div
            key={ADMIN_ID}
            onClick={() => { setSelectedId(ADMIN_ID); navigate(`/freelancer/messages/${ADMIN_ID}`); }}
            style={{
              padding: '12px 16px',
              background: (selectedId === ADMIN_ID) ? '#e6f0ff' : 'transparent',
              cursor: 'pointer',
              borderBottom: '1px solid #f0f0f0',
              fontWeight: 500
            }}
          >
            Admin
          </div>
        )}
      </div>
      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #eee', background: '#f9f9f9', minHeight: 60 }}>
          {selectedUser ? (
            <>
              <b>Chat with: {selectedUser.name}</b>
            </>
          ) : (
            <span>Select a conversation to start chatting</span>
          )}
        </div>
        <div style={{ flex: 1, padding: 16 }}>
          {selectedId ? (
            <ChatBox
              room={getRoomName(ADMIN_ID, user?._id?.toString())}
              user={user?._id?.toString()}
              peer={ADMIN_ID}
            />
          ) : (
            <div style={{ color: '#888', marginTop: 40 }}>No conversation selected.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerMessages;
