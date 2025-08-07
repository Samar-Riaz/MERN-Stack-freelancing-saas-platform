import React, { useEffect, useState, useRef } from 'react';
import socket from '../utils/socket';

const ChatBox = ({ room, user, peer, prefill = '', onPrefillUsed }) => {
  console.log('ChatBox:', room, user, peer);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(prefill);
  const messagesEndRef = useRef(null);
  const joinedRef = useRef(false);

  // Only connect/disconnect socket on mount/unmount
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  // Join room and listen for messages
  useEffect(() => {
    if (!room || !user) return;

    // Leave previous room if any
    if (joinedRef.current) {
      socket.emit('leave', joinedRef.current);
    }

    socket.emit('join', room);
    joinedRef.current = room;

    const handleReceive = (data) => {
      console.log('Received:', data);
      // Only add if not duplicate
      setMessages((prev) => {
        if (prev.length && prev[prev.length - 1].message === data.message && prev[prev.length - 1].sender === data.sender) return prev;
        return [...prev, data];
      });
    };
    socket.on('receive_message', handleReceive);
    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [room, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (prefill) setInput(prefill);
  }, [prefill]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = {
      room,
      message: input,
      sender: user,
      receiver: peer,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit('send_message', msg);
    setMessages((prev) => [...prev, msg]);
    setInput('');
    if (onPrefillUsed && input === prefill) onPrefillUsed();
  };

  if (!user || !user._id) {
    return <div>Please log in as a freelancer to use chat.</div>;
  }

  return (
    <div className="chatbox" style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div className="chat-messages" style={{flex:1,overflowY:'auto',background:'#f8f8f8',padding:8,borderRadius:4,minHeight:300,maxHeight:400}}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display:'flex',
            flexDirection:'column',
            alignItems:msg.sender===user?'flex-end':'flex-start',
            margin:'8px 0'
          }}>
            <div style={{
              background:msg.sender===user?'#daf8cb':'#fff',
              color:'#222',
              borderRadius:12,
              padding:'8px 16px',
              maxWidth:280,
              boxShadow:'0 1px 4px #0001',
              fontSize:15
            }}>
              {msg.message}
            </div>
            <span style={{fontSize:'0.8em',color:'#888',marginTop:2}}>{msg.sender===user?'You':msg.sender} • {msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{display:'flex',marginTop:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message..." style={{flex:1,padding:8,borderRadius:8,border:'1px solid #ccc',marginRight:8}} />
        <button className="btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
