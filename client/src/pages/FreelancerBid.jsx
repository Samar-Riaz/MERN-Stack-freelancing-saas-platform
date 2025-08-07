import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import socket from '../utils/socket';
import NotificationPopup from '../components/NotificationPopup';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const FreelancerBid = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState('');
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidForm, setBidForm] = useState({ amount: '', timeline: '', message: '' });
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');

  // Socket notification effect
  useEffect(() => {
    // Connect to socket and listen for incoming messages for this freelancer
    if (user && user._id) {
      socket.connect();
      socket.emit('join', user._id); // join personal room
      socket.on('receive_message', (msg) => {
        // Only show popup if message is for this user and from admin
        if (msg.receiver === user._id && msg.senderRole === 'admin') {
          setNotification(msg.message || 'You have a new message from admin');
        }
      });
    }
    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    console.log('Fetching job with jobId:', jobId);
    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.getFreelancerJob(jobId);
        setJob(res.data);
      } catch (err) {
        console.error('Fetch job error:', err, err.response);
        setError(err.response?.data?.message || 'Failed to fetch job');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleBidChange = (e) => {
    setBidForm({ ...bidForm, [e.target.name]: e.target.value });
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidLoading(true);
    setBidError('');
    setBidSuccess('');
    try {
      await API.submitBid(jobId, {
        bid_amount: bidForm.amount ? parseFloat(bidForm.amount) : 0,
        timeline: bidForm.timeline ? parseInt(bidForm.timeline) : 0,
        message: bidForm.message || ''
      });
      setBidSuccess('Bid submitted successfully!');
      setTimeout(() => {
        navigate('/freelancer/bids');
      }, 1000);
      setBidForm({ amount: '', timeline: '', message: '' });
    } catch (err) {
      setBidError(err.response?.data?.message || 'Failed to submit bid');
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) return <div>Loading job...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <div className="freelancer-bid-page">
      <NotificationPopup message={notification} onClose={() => setNotification('')} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button className="btn-secondary" onClick={() => navigate(-1)}>&larr; Back</button>
        <button className="btn-secondary" onClick={() => navigate('/freelancer')}>Return to Dashboard</button>
      </div>
      <div className="job-card-large">
        <h2>{job.title}</h2>
        <p><b>Category:</b> {job.category}</p>
        <p><b>Budget:</b> ${job.budget}</p>
        <p><b>Deadline:</b> {job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}</p>
        <p><b>Description:</b> {job.description || 'No description.'}</p>
      </div>
      <form onSubmit={handleBidSubmit} className="bid-form">
        <h3>Submit a Bid</h3>
        <div>
          <label>Bid Amount ($):</label>
          <input type="number" name="amount" value={bidForm.amount} onChange={handleBidChange} required min="1" step="0.01" />
        </div>
        <div>
          <label>Timeline (days):</label>
          <input type="number" name="timeline" value={bidForm.timeline} onChange={handleBidChange} required min="1" />
        </div>
        <div>
          <label>Message:</label>
          <textarea name="message" value={bidForm.message} onChange={handleBidChange} required />
        </div>
        {bidError && <div className="error">{bidError}</div>}
        {bidSuccess && <div className="success">{bidSuccess}</div>}
        <div className="modal-actions">
          <button type="submit" className="btn-primary" disabled={bidLoading}>Submit Bid</button>
        </div>
      </form>
    </div>
  );
};

export default FreelancerBid;
