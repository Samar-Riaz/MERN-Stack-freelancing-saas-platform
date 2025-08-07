

import express from 'express';
import Job from '../models/Job.js';
import Bid from '../models/Bid.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = express.Router();

// DELETE /api/admin/bids/:id
router.delete('/bids/:id', async (req, res) => {
  try {
    const bid = await Bid.findByIdAndDelete(req.params.id);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    res.json({ message: 'Bid deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/bids/:id/accept - Accept a bid and delete all other bids for the same job
router.post('/bids/:id/accept', async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    // Set accepted status
    bid.status = 'accepted';
    await bid.save();
    // Delete all other bids for the same job
    await Bid.deleteMany({ job_id: bid.job_id, _id: { $ne: bid._id } });


    // Send a formal message to the user whose bid is accepted
    // Find admin user (sender)
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      await Message.create({
        job_id: bid.job_id,
        from_user_id: adminUser._id,
        to_user_id: bid.user_id,
        content: `Congratulations! Your bid for the job has been accepted by the admin. Please check your dashboard for further details.`
      });
    }

    // Create a new Task for the accepted bid and job, assign to user
    await Task.create({
      job_id: bid.job_id,
      title: `Task for job: ${bid.job_id}`,
      assigned_user_id: bid.user_id,
      status: 'todo'
    });

    res.json({ message: 'Bid accepted and other bids deleted', bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Job.countDocuments();
    const active = await Job.countDocuments({ status: 'active' });
    const completed = await Job.countDocuments({ status: 'completed' });
    const pendingBids = await Bid.countDocuments({ status: 'pending' });
    res.json({ total, active, completed, pendingBids });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/jobs
router.get('/jobs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(limit);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/jobs
router.post('/jobs', async (req, res) => {
  try {
    const { title, description, budget, deadline, category } = req.body;
    // TODO: Use real admin user ID from auth in production
    const poster_id = req.body.poster_id || (await (await import('../models/User.js')).default.findOne({ role: 'admin' }))._id;
    const job = await Job.create({
      title,
      description,
      budget,
      deadline,
      category,
      poster_id
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/jobs/:id
router.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/admin/bids - List all bids with job and user info
router.get('/bids', async (req, res) => {
  try {
    const bids = await Bid.find()
      .populate('job_id', 'title')
      .populate('user_id', 'name email')
      .sort('-createdAt');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
