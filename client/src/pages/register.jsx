import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.name || !form.email || !form.password) {
      setIsLoading(false);
      return setError('All fields are required!');
    }

    if (!isEmailValid(form.email)) {
      setIsLoading(false);
      return setError('Please enter a valid email.');
    }

    if (form.password.length < 6) {
      setIsLoading(false);
      return setError('Password must be at least 6 characters.');
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      setIsLoading(false);
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join PandaHire to start your freelance journey</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              onChange={handleChange}
              className={error && !form.name ? 'input-error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className={error && !form.email ? 'input-error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password (min 6 chars)"
              onChange={handleChange}
              className={error && !form.password ? 'input-error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select 
              id="role" 
              name="role" 
              onChange={handleChange}
              className="role-select"
            >
              <option value="freelancer">Freelancer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="terms-agreement">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>
          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Create Account'}
          </button>
          
          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;