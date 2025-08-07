import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [form, setForm] = useState({ name: '', email: '', skills: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get('/users/me');
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          skills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : '',
          bio: res.data.bio || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await API.put('/users/me', {
        name: form.name,
        email: form.email,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        bio: form.bio,
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="edit-profile-page">
      <h2>Edit Profile</h2>
      {loading ? <div>Loading...</div> : (
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} required type="email" />
          </div>
          <div>
            <label>Skills (comma separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange} />
          </div>
          <div>
            <label>Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} />
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <div className="modal-actions">
            <button className="btn-primary" type="submit">Save Changes</button>
            <button className="btn-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProfile;
