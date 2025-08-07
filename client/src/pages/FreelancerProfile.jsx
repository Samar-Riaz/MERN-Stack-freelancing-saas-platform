import React, { useEffect, useState } from 'react';
import API from '../api';

const FreelancerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/me');
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <h2>{profile.name}'s Freelancer Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
      <p>Skills: {profile.skills?.join(', ')}</p>
      <p>Bio: {profile.bio}</p>
      <p>Progress: {profile.progress}%</p>
      <div className="profile-actions">
        <a href="/profile/edit" className="btn-primary">Edit Profile</a>
        <a href="/profile/change-password" className="btn-secondary">Change Password</a>
      </div>
    </div>
  );
};

export default FreelancerProfile;
