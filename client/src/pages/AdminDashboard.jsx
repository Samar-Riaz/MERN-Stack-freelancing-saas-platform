// client/src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDashboard, MdWork, MdMessage, MdAssessment } from 'react-icons/md';
import { FaFileAlt, FaUser, FaCog, FaBell, FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import API from '../api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingBids: 0,
    completedJobs: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to continue');
          navigate('/login');
          return;
        }

        const [statsRes, jobsRes] = await Promise.all([
          API.getStats(),
          API.getJobs({ limit: 5 }),
        ]);

        setStats({
          totalJobs: statsRes.data.total || 0,
          activeJobs: statsRes.data.active || 0,
          pendingBids: statsRes.data.pendingBids || 0,
          completedJobs: statsRes.data.completed || 0,
        });
        setRecentJobs(jobsRes.data);
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

    fetchDashboardData();
  }, [navigate]);

  const handleJobCreate = () => {
    navigate('/admin/jobs/create');
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await API.deleteJob(jobId);
      setRecentJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      setStats((prev) => ({
        ...prev,
        totalJobs: prev.totalJobs - 1,
        activeJobs: recentJobs.find((job) => job._id === jobId)?.status === 'active'
          ? prev.activeJobs - 1
          : prev.activeJobs,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
    }
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
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin" className="active">
            <MdDashboard /> Dashboard
          </Link>
          <Link to="/admin/jobs">
            <MdWork /> Manage Jobs
          </Link>
          <Link to="/admin/bids">
            <FaFileAlt /> Review Bids
          </Link>
          <Link to="/admin/messages">
            <MdMessage /> Messages
          </Link>
          <Link to="/admin/reports">
            <MdAssessment /> Reports
          </Link>
          <Link to="/admin/settings">
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
            <input type="text" placeholder="Search jobs or freelancers..." />
          </div>
          <div className="user-actions">
            <button className="notification">
              <FaBell />
              <span className="badge">3</span>
            </button>
            <div className="user-menu">
              <FaUser />
              <span>Admin</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <h1>Admin Dashboard</h1>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Jobs</h3>
              <p>{stats.totalJobs}</p>
              <Link to="/admin/jobs">View All</Link>
            </div>
            <div className="stat-card">
              <h3>Active Jobs</h3>
              <p>{stats.activeJobs}</p>
              <Link to="/admin/jobs?status=active">View Active</Link>
            </div>
            <div className="stat-card">
              <h3>Pending Bids</h3>
              <p>{stats.pendingBids}</p>
              <Link to="/admin/bids">Review Now</Link>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p>{stats.completedJobs}</p>
              <Link to="/admin/jobs?status=completed">View History</Link>
            </div>
          </div>

          <div className="quick-actions">
            <button onClick={handleJobCreate} className="btn-primary">
              <FaPlus /> Create New Job
            </button>
            <Link to="/admin/bids" className="btn-secondary">
              Review Pending Bids
            </Link>
          </div>

          <div className="section">
            <div className="section-header">
              <h2>Recent Jobs</h2>
              <Link to="/admin/jobs" className="view-all">View All</Link>
            </div>
            {recentJobs.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <Link to={`/admin/jobs/${job._id}`}>{job.title}</Link>
                      </td>
                      <td>{job.category}</td>
                      <td>${job.budget}</td>
                      <td>
                        <span className={`status-badge ${job.status}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/jobs/${job._id}/edit`} className="btn-text">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="btn-text danger"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No jobs found</p>
            )}
          </div>

          <div className="section">
            <h2>Pending Actions</h2>
            <Link to="/admin/bids" className="btn-text">
              View All Pending Bids
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;