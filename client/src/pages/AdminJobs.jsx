import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.getJobs();
        setJobs(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setError('');
    setSuccess('');
    try {
      await API.deleteJob(jobId);
      setJobs(jobs.filter(j => j._id !== jobId));
      setSuccess('Job deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="admin-jobs-page">
      <h2>All Jobs</h2>
      <button className="btn-primary" onClick={() => navigate('/admin/jobs/create')}>Create New Job</button>
      {loading ? <div>Loading...</div> : (
        <>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Budget</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.category}</td>
                  <td>${job.budget}</td>
                  <td>{job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}</td>
                  <td>{job.status}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(job._id)}>Delete</button>
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

export default AdminJobs;
