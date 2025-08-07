// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Admin Services
export const adminService = {
  // Dashboard
  getStats: () => api.get('/admin/dashboard/stats'),
  
  // Jobs
  createJob: (jobData) => api.post('/admin/jobs', jobData),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  getJob: (id) => api.get(`/admin/jobs/${id}`),
  updateJob: (id, jobData) => api.put(`/admin/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  
  // Bids
  getBids: (jobId) => api.get(`/admin/jobs/${jobId}/bids`),
  acceptBid: (bidId) => api.put(`/admin/bids/${bidId}/accept`),
  rejectBid: (bidId) => api.put(`/admin/bids/${bidId}/reject`),
  
  // Tasks
  createTask: (jobId, taskData) => api.post(`/admin/jobs/${jobId}/tasks`, taskData),
  updateTask: (taskId, taskData) => api.put(`/admin/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/admin/tasks/${taskId}`),
  
  // Messages
  getMessages: (jobId) => api.get(`/admin/jobs/${jobId}/messages`),
  sendMessage: (jobId, message) => api.post(`/admin/jobs/${jobId}/messages`, message),
  
  // Ratings & Certificates
  rateFreelancer: (jobId, ratingData) => api.post(`/admin/jobs/${jobId}/rate`, ratingData),
  generateCertificate: (jobId) => api.post(`/admin/jobs/${jobId}/certificate`),
};

// Freelancer Services
export const freelancerService = {
  // Dashboard
  getStats: () => api.get('/freelancer/dashboard/stats'),
  
  // Profile
  updateProfile: (profileData) => api.put('/freelancer/profile', profileData),
  
  // Jobs
  getAvailableJobs: (params) => api.get('/freelancer/jobs/available', { params }),
  getJobDetails: (id) => api.get(`/freelancer/jobs/${id}`),
  
  // Bids
  submitBid: (jobId, bidData) => api.post(`/freelancer/jobs/${jobId}/bids`, bidData),
  getMyBids: () => api.get('/freelancer/bids'),
  
  // Tasks
  getMyTasks: () => api.get('/freelancer/tasks'),
  updateTaskStatus: (taskId, status) => api.put(`/freelancer/tasks/${taskId}`, { status }),
  
  // Messages
  getMessages: (jobId) => api.get(`/freelancer/jobs/${jobId}/messages`),
  sendMessage: (jobId, message) => api.post(`/freelancer/jobs/${jobId}/messages`, message),
  
  // Work Submission
  submitWork: (taskId, formData) => api.post(`/freelancer/tasks/${taskId}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Common Services
export const commonService = {
  downloadCertificate: (jobId) => api.get(`/certificates/${jobId}/download`, {
    responseType: 'blob',
  }),
};

export default api;