import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await API.put('/users/me/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Password changed successfully!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <h2>Change Password</h2>
      <form className="change-password-form" onSubmit={handleSubmit}>
        <div>
          <label>Current Password</label>
          <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} required />
        </div>
        <div>
          <label>New Password</label>
          <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required minLength={6} />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required minLength={6} />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <div className="modal-actions">
          <button className="btn-primary" type="submit" disabled={loading}>Change Password</button>
          <button className="btn-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
