// ...existing code...
// client/src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Admin endpoints
  getStats: () => API.get('/admin/stats'),
  getJobs: (params) => API.get('/admin/jobs', { params }),
  createJob: (data) => API.post('/admin/jobs', data),
  getBids: () => API.get('/admin/bids'),
  deleteBid: (bidId) => API.delete(`/admin/bids/${bidId}`),
  acceptBid: (bidId) => API.post(`/admin/bids/${bidId}/accept`),
  deleteJob: (jobId) => API.delete(`/admin/jobs/${jobId}`),
// Freelancer endpoints
  getFreelancerStats: () => API.get('/freelancer/stats'),
  getAvailableJobs: (params) => API.get('/jobs', { params }),
  getMessages: (params) => API.get('/messages', { params }),
  submitBid: (jobId, data) => API.post(`/bids/${jobId}`, data),
  submitFreelancerBid: (jobId, data) => API.post(`/freelancer/bids/${jobId}`, data),
  getFreelancerJob: (jobId) => API.get(`/freelancer/job/${jobId}`),
  getMyBids: () => API.get('/bids/my-bids'),
  // User profile endpoints
  getUserProfile: (id) => API.get(`/users/${id}`),
  getCurrentUserProfile: () => API.get('/users/me'),
};