
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  accepted: 'green',
  pending: 'orange',
  rejected: 'red',
};

const FreelancerBids = () => {
  useAuth(); // just to ensure auth context is loaded
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const res = await api.getMyBids();
        setBids(res.data);
      } catch {
        setError('Failed to load bids');
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  if (loading) return <div>Loading your bids...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button className="btn-secondary" onClick={() => navigate('/freelancer')}>Return to Dashboard</button>
        <button className="btn-secondary" onClick={() => navigate('/freelancer/jobs')}>Continue to Bidding</button>
      </div>
      <h2 style={{ marginBottom: 24 }}>My Bids</h2>
      {bids.length === 0 ? (
        <div>You have not placed any bids yet.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>Job Title</th>
              <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>Budget</th>
              <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>Deadline</th>
              <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>Bid Amount</th>
              <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>Timeline</th>
              <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid._id}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{bid.job_id?.title || 'N/A'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{bid.job_id?.budget ? `₹${bid.job_id.budget}` : 'N/A'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{bid.job_id?.deadline ? new Date(bid.job_id.deadline).toLocaleDateString() : 'N/A'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{bid.bid_amount || bid.amount || 'N/A'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{bid.timeline || 'N/A'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee', color: statusColors[bid.status] || '#333', fontWeight: 600 }}>
                  {bid.status ? bid.status.charAt(0).toUpperCase() + bid.status.slice(1) : 'Pending'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FreelancerBids;
