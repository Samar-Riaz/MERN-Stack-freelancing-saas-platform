// client/src/components/FreelancerDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDashboard, MdWork, MdMessage } from 'react-icons/md';
import { FaFileAlt, FaUser, FaCog, FaBell, FaSearch, FaPlus, FaStar } from 'react-icons/fa';
import API from '../api';
import './Dashboard.css';

const FreelancerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    activeBids: 0,
    completedJobs: 0,
    avgRating: 0,
    earnings: 0,
    pendingBids: 0,
  });
  const [availableJobs, setAvailableJobs] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [bidForm, setBidForm] = useState({ bidAmount: '', timeline: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to continue');
          navigate('/login');
          return;
        }

        const [statsRes, jobsRes, messagesRes] = await Promise.all([
          API.getFreelancerStats(),
          API.getAvailableJobs({ limit: 5, status: 'open' }),
          API.getMessages({ limit: 5 }),
        ]);

        setStats({
          activeBids: statsRes.data.activeBids || 0,
          completedJobs: statsRes.data.completedJobs || 0,
          avgRating: statsRes.data.avgRating || 0,
          earnings: statsRes.data.earnings || 0,
          pendingBids: statsRes.data.pendingBids || 0,
        });
        setAvailableJobs(jobsRes.data);
        setRecentMessages(messagesRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
        const message = err.response?.data?.message || `Failed to fetch data: ${err.message}`;
        setError(message);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleOpenBidModal = (jobId) => {
    setSelectedJobId(jobId);
    setShowBidModal(true);
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await await API.submitBid(selectedJobId, {
        bidAmount: parseFloat(bidForm.bidAmount),
        timeline: parseInt(bidForm.timeline),
        message: bidForm.message,
      });
      setShowBidModal(false);
      setBidForm({ bidAmount: '', timeline: '', message: '' });
      alert('Bid submitted successfully!'); // Replace with toast later
      navigate('/freelancer/bids');
    } catch (err) {
      setError(err.response?.data?.message || 'Bid submission failed');
    }
  };

  const handleSearch = (e) => {
    console.log('Search query:', e.target.value);
    // Implement search logic later
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return (
    <div className="error">
      {error}
      {error.includes('401') && (
        <p>
          <Link to="/login" className="btn-text">Please log in again</Link>
        </p>
      )}
    </div>
  );

  return (
    <div className={`dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="sidebar">
        <h2>Freelancer Hub</h2>
        <nav>
          <Link to="/freelancer" className="active">
            <MdDashboard /> Dashboard
          </Link>
          <Link to="/freelancer/jobs">
            <MdWork /> Find Jobs
          </Link>
          <Link to="/freelancer/bids">
            <FaFileAlt /> My Bids
          </Link>
          <Link to="/freelancer/messages">
            <MdMessage /> Messages
          </Link>
          <Link to="/freelancer/profile">
            <FaUser /> Profile
          </Link>
          <Link to="/freelancer/settings">
            <FaCog /> Settings
          </Link>
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="search">
            <FaSearch />
            <input type="text" placeholder="Search jobs..." onChange={handleSearch} />
          </div>
          <div className="user-actions">
            <button className="notification">
              <FaBell />
              <span className="badge">3</span>
            </button>
            <div className="user-menu">
              <FaUser />
              <span>Freelancer</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <h1>Freelancer Dashboard</h1>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Active Bids</h3>
              <p>{stats.activeBids}</p>
              <Link to="/freelancer/bids">View All</Link>
            </div>
            <div className="stat-card">
              <h3>Pending Bids</h3>
              <p>{stats.pendingBids}</p>
              <Link to="/freelancer/bids?status=pending">View Pending</Link>
            </div>
            <div className="stat-card">
              <h3>Completed Jobs</h3>
              <p>{stats.completedJobs}</p>
              <Link to="/freelancer/jobs?status=completed">View History</Link>
            </div>
            <div className="stat-card">
              <h3>Avg Rating</h3>
              <p>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.round(stats.avgRating) ? 'star filled' : 'star'}
                  />
                ))}
                <small> ({stats.avgRating.toFixed(1)}/5)</small>
              </p>
            </div>
            <div className="stat-card">
              <h3>Earnings</h3>
              <p>${stats.earnings.toLocaleString()}</p>
              <Link to="/freelancer/earnings">View Breakdown</Link>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/freelancer/jobs" className="btn-primary">
              <FaPlus /> Find New Jobs
            </Link>
            <Link to="/freelancer/profile" className="btn-secondary">
              Update Profile
            </Link>
          </div>

          <div className="section">
            <div className="section-header">
              <h2>Available Jobs</h2>
              <Link to="/freelancer/jobs" className="view-all">View All</Link>
            </div>
            {availableJobs.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {availableJobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <Link to={`/freelancer/jobs/${job._id}`}>{job.title}</Link>
                      </td>
                      <td>{job.category}</td>
                      <td>${job.budget}</td>
                      <td>{new Date(job.deadline).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleOpenBidModal(job._id)}
                          className="btn-primary"
                        >
                          <FaPlus /> Bid
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No available jobs found</p>
            )}
          </div>

          <div className="section">
            <div className="section-header">
              <h2>Recent Messages</h2>
              <Link to="/freelancer/messages" className="view-all">View All</Link>
            </div>
            {recentMessages.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMessages.map((message) => (
                    <tr key={message._id}>
                      <td>{message.sender}</td>
                      <td>{message.subject}</td>
                      <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/freelancer/messages/${message._id}`} className="btn-text">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No messages found</p>
            )}
          </div>
        </div>
      </main>

      {showBidModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Submit Bid</h2>
            <form onSubmit={handleBidSubmit}>
              <div className="form-group">
                <label>Bid Amount ($)</label>
                <input
                  type="number"
                  value={bidForm.bidAmount}
                  onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })}
                  required
                  min="1"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Timeline (days)</label>
                <input
                  type="number"
                  value={bidForm.timeline}
                  onChange={(e) => setBidForm({ ...bidForm, timeline: e.target.value })}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Proposal Message</label>
                <textarea
                  value={bidForm.message}
                  onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Submit Bid
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowBidModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerDashboard;