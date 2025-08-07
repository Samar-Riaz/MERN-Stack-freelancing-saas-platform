import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import Login from './pages/login';
import Register from './pages/register';
// ...existing code...
// Admin subpages
import AdminJobs from './pages/AdminJobs';
import AdminBids from './pages/AdminBids';
import AdminMessages from './pages/AdminMessages';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import AdminJobEdit from './pages/AdminJobEdit';
import AdminJobCreate from './pages/AdminJobCreate';
// Freelancer subpages
import FreelancerJobs from './pages/FreelancerJobs';
import FreelancerBids from './pages/FreelancerBids';
import FreelancerMessages from './pages/FreelancerMessages';
import FreelancerProfile from './pages/FreelancerProfile';
import FreelancerSettings from './pages/FreelancerSettings';
import FreelancerEarnings from './pages/FreelancerEarnings';
import FreelancerBid from './pages/FreelancerBid';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<FreelancerProfile />} />
        <Route path="/profile/edit" element={<FreelancerProfile editMode={true} />} />
        <Route path="/profile/change-password" element={<FreelancerProfile changePasswordMode={true} />} />
        {/* Admin Dashboard & Subpages */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/jobs/create" element={<AdminJobCreate />} />
        <Route path="/admin/jobs/:jobId/edit" element={<AdminJobEdit />} />
        <Route path="/admin/bids" element={<AdminBids />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/messages/:userId" element={<AdminMessages />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        {/* Freelancer Dashboard & Subpages */}
        <Route path="/freelancer" element={<FreelancerDashboard />} />
        <Route path="/freelancer/jobs" element={<FreelancerJobs />} />
        <Route path="/freelancer/bids" element={<FreelancerBids />} />
        <Route path="/freelancer/messages" element={<FreelancerMessages />} />
        <Route path="/freelancer/messages/:conversationId" element={<FreelancerMessages />} />
        <Route path="/freelancer/profile" element={<FreelancerProfile />} />
        <Route path="/freelancer/settings" element={<FreelancerSettings />} />
        <Route path="/freelancer/earnings" element={<FreelancerEarnings />} />
        <Route path="/freelancer/jobs/:jobId/bid" element={<FreelancerBid />} />
      </Routes>
    </Router>
  );
};

export default App;
