import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../../api';

const Sidebar = ({ role = 'admin' }) => {
  const [unread, setUnread] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await API.getMessages();
        const unreadCount = res.data.filter(m => !m.is_read && ((role === 'admin' && m.to_user_id === 'admin') || (role === 'freelancer' && m.to_user_id !== 'admin'))).length;
        setUnread(unreadCount);
      } catch {
        setUnread(0);
      }
    };
    fetchUnread();
  }, [location, role]);

  return (
    <div style={{ width: 220, background: '#f5f6fa', height: '100vh', borderRight: '1px solid #eee', padding: 0 }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Link to={role === 'admin' ? '/admin' : '/freelancer'} className="sidebar-link">Dashboard</Link>
        <Link to={role === 'admin' ? '/admin/jobs' : '/freelancer/jobs'} className="sidebar-link">Jobs</Link>
        <Link to={role === 'admin' ? '/admin/bids' : '/freelancer/bids'} className="sidebar-link">Bids</Link>
        <Link to={role === 'admin' ? '/admin/messages' : '/freelancer/messages'} className="sidebar-link" style={{ position: 'relative' }}>
          Messages
          {unread > 0 && (
            <span style={{ position: 'absolute', right: 8, top: 8, background: '#e74c3c', color: '#fff', borderRadius: '50%', padding: '2px 8px', fontSize: 12 }}>{unread}</span>
          )}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
