import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const FreelancerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.getAvailableJobs({ limit: 20 });
        setJobs(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleJobClick = (jobId) => {
    navigate(`/freelancer/jobs/${jobId}/bid`);
  };

  return (
    <div className="freelancer-jobs-page">
      <h2>Available Jobs</h2>
      {loading ? (
        <div>Loading jobs...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : jobs.length === 0 ? (
        <div>No jobs found.</div>
      ) : (
        <div className="jobs-flex-list">
          {jobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h3>{job.title}</h3>
              <p><b>Category:</b> {job.category}</p>
              <p><b>Budget:</b> ${job.budget}</p>
              <p><b>Deadline:</b> {job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}</p>
              <p className="job-desc">{job.description || 'No description.'}</p>
              <button className="btn-primary" onClick={() => handleJobClick(job._id)}>View & Bid</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerJobs;
