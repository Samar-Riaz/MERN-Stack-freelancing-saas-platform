import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // For debugging: show the token in the UI
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        let res;
        if (id) {
          res = await API.getUserProfile(id, { params: { token } });
        } else {
          res = await API.getCurrentUserProfile({ params: { token } });
        }
        console.log('Profile response:', res.data);
        // Accept any object as a valid profile
        if (res && res.data && typeof res.data === 'object') {
          setProfile(res.data);
        } else {
          setError('Profile data is invalid');
        }
      } catch (err) {
        if (!id && err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch profile');
        }
      }
    };
    fetchProfile();
  }, [navigate, id]);

  if (error) {
    return (
      <div>
        <p className="error">{error}</p>
        <p style={{fontSize: '0.9em', color: '#888'}}>Raw profile response (see console for details):</p>
        <pre id="profile-debug" style={{background:'#f8f8f8', padding:'8px', borderRadius:'4px', overflowX:'auto'}}></pre>
        <div style={{marginTop: '1em', color: '#b00', fontWeight: 'bold'}}>
          JWT Token: {token ? <span style={{wordBreak:'break-all'}}>{token}</span> : <span style={{color:'#c00'}}>No token found in localStorage!</span>}
        </div>
      </div>
    );
  }
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <h2>{profile.name ? profile.name : 'User'}'s Profile</h2>
      <p>Email: {profile.email || '-'}</p>
      <p>Role: {profile.role || '-'}</p>
      <p>Skills: {Array.isArray(profile.skills) ? profile.skills.join(', ') : '-'}</p>
      <p>Bio: {profile.bio || '-'}</p>
      <p>Progress: {profile.progress !== undefined ? profile.progress + '%' : '-'}</p>
      <div className="profile-actions">
        <a href="/profile/edit" className="btn-primary">Edit Profile</a>
        <a href="/profile/change-password" className="btn-secondary">Change Password</a>
      </div>
      <div style={{marginTop: '2em', color: '#b00', fontWeight: 'bold'}}>
        JWT Token: {token ? <span style={{wordBreak:'break-all'}}>{token}</span> : <span style={{color:'#c00'}}>No token found in localStorage!</span>}
      </div>
    </div>
  );
};

export default Profile;
