import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AdminBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.getBids();
        setBids(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bids');
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  const handleAccept = async (bid) => {
    if (!window.confirm('Accept this bid? This will delete all other bids for this job.')) return;
    setError('');
    setSuccess('');
    try {
      await API.acceptBid(bid._id);
      // Update the status of the accepted bid and remove other bids for the same job
      setBids(bids => bids
        .filter(b => b.job_id?._id !== bid.job_id?._id || b._id === bid._id)
        .map(b => b._id === bid._id ? { ...b, status: 'accepted' } : b)
      );
      setSuccess('Bid accepted and other bids deleted! Redirecting to chat...');
      // Always use string user ID for redirect and state
      const userId = typeof bid.user_id === 'object' ? bid.user_id._id : bid.user_id;
      setTimeout(() => {
        navigate(`/admin/messages/${userId}`, { state: { acceptedUserId: userId } });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept bid');
    }
  };

  return (
    <div className="admin-bids-page">
      <h2>All Bids</h2>
      {loading ? <div>Loading...</div> : (
        <>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <table className="bids-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>User</th>
                <th>Amount</th>
                <th>Timeline</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bids.map(bid => (
                <tr key={bid._id}>
                  <td>{bid.job_id?.title || '-'}</td>
                  <td>{bid.user_id?.name || '-'}</td>
                  <td>${bid.bid_amount}</td>
                  <td>{bid.timeline} days</td>
                  <td>{bid.message}</td>
                  <td>{bid.createdAt ? new Date(bid.createdAt).toLocaleString() : '-'}</td>
                  <td>
                    {bid.status === 'accepted' ? (
                      <span className="success">Accepted</span>
                    ) : (
                      <button className="btn-primary" onClick={() => handleAccept(bid)} disabled={bids.some(b => b.job_id?._id === bid.job_id?._id && b.status === 'accepted')}>
                        Accept
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminBids;
