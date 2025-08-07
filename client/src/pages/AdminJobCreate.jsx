import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AdminJobCreate = () => {
  const [form, setForm] = useState({
    title: '',
    category: '',
    budget: '',
    deadline: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await API.createJob({
        title: form.title,
        category: form.category,
        budget: parseFloat(form.budget),
        deadline: form.deadline,
        description: form.description,
      });
      setSuccess('Job created successfully!');
      setTimeout(() => navigate('/admin/jobs'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-job-create-page">
      <h2>Create New Job</h2>
      <form className="admin-job-create-form" onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Category</label>
          <input name="category" value={form.category} onChange={handleChange} required />
        </div>
        <div>
          <label>Budget ($)</label>
          <input name="budget" type="number" min="1" step="0.01" value={form.budget} onChange={handleChange} required />
        </div>
        <div>
          <label>Deadline</label>
          <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <div className="modal-actions">
          <button className="btn-primary" type="submit" disabled={loading}>Create Job</button>
          <button className="btn-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminJobCreate;
