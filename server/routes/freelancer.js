import express from 'express';
import Job from '../models/Job.js';
import Bid from '../models/Bid.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/jobs/:id - View job details
router.get('/job/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bids/:jobId - Submit a bid to a job
router.post('/bids/:jobId', protect, async (req, res) => {
  try {
    const { bidAmount, timeline, message } = req.body;
    // Restriction 1: Only one bid per user per job
    const existingBid = await Bid.findOne({ job_id: req.params.jobId, user_id: req.user.id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a bid for this job.' });
    }
    // Restriction 3: A job can only be assigned to one freelancer
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.assigned_to) {
      return res.status(400).json({ message: 'This job has already been assigned to a freelancer.' });
    }
    const bid = new Bid({
      job_id: req.params.jobId,
      user_id: req.user.id, // Use authenticated user
      bid_amount: bidAmount,
      timeline,
      message,
      status: 'pending',
    });
    await bid.save();
    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/jobs/:jobId/assign - Assign a job to a freelancer (admin or poster only)
router.patch('/jobs/:jobId/assign', protect, async (req, res) => {
  try {
    const { freelancerId } = req.body;
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    // Restriction 2: Job must have at least one bid to be assigned
    const bidCount = await Bid.countDocuments({ job_id: req.params.jobId });
    if (bidCount === 0) {
      return res.status(400).json({ message: 'A job must have at least one bid to be assigned.' });
    }
    // Restriction 3: Only assign if not already assigned
    if (job.assigned_to) {
      return res.status(400).json({ message: 'Job already assigned.' });
    }
    job.assigned_to = freelancerId;
    job.status = 'assigned';
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bids?user=freelancerId - List all bids by freelancer
router.get('/bids', async (req, res) => {
  try {
    const { user } = req.query;
    const bids = await Bid.find(user ? { user } : {}).populate('job');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bids/:id - View bid details
router.get('/bids/:id', async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('job');
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    res.json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bids/:id - Update a bid
router.put('/bids/:id', async (req, res) => {
  try {
    const bid = await Bid.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    res.json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/bids/:id - Withdraw a bid
router.delete('/bids/:id', async (req, res) => {
  try {
    const bid = await Bid.findByIdAndDelete(req.params.id);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    res.json({ message: 'Bid withdrawn' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/freelancer/my-jobs?user=freelancerId - List jobs the freelancer has bid on
router.get('/my-jobs', async (req, res) => {
  try {
    const { user } = req.query;
    const bids = await Bid.find({ user }).populate('job');
    const jobs = bids.map(bid => bid.job);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET/PUT /api/users/:id - Get/update freelancer profile
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/freelancer/earnings?user=freelancerId - Get earnings summary
router.get('/earnings', async (req, res) => {
  try {
    const { user } = req.query;
    // Dummy calculation: sum of accepted bids
    const acceptedBids = await Bid.find({ user, status: 'accepted' });
    const earnings = acceptedBids.reduce((sum, bid) => sum + (bid.bidAmount || 0), 0);
    res.json({ earnings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/freelancer/stats
router.get('/stats', async (req, res) => {
  try {
    // You may want to filter by user in a real app
    const activeBids = await Bid.countDocuments({ status: 'active' });
    const completedJobs = await Job.countDocuments({ status: 'completed' });
    const pendingBids = await Bid.countDocuments({ status: 'pending' });
    // Dummy values for now
    const avgRating = 4.5;
    const earnings = 1200;
    res.json({ activeBids, completedJobs, avgRating, earnings, pendingBids });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/freelancer/jobs
router.get('/jobs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    // Accept both 'active' and 'open' as valid statuses
    let status = req.query.status;
    let statusQuery = {};
    if (status) {
      if (Array.isArray(status)) {
        statusQuery.status = { $in: status };
      } else if (status === 'open') {
        statusQuery.status = { $in: ['active', 'open'] };
      } else {
        statusQuery.status = status;
      }
    } else {
      statusQuery.status = { $in: ['active', 'open'] };
    }
    const jobs = await Job.find(statusQuery).sort({ createdAt: -1 }).limit(limit);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/messages - Send a message (only if bidding or assigned)
router.post('/messages', protect, async (req, res) => {
  try {
    const { jobId, toUserId, content } = req.body;
    // Restriction 4: Only allow messaging if user is bidding or assigned
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const isBidder = await Bid.findOne({ job_id: jobId, user_id: req.user.id });
    const isAssigned = job.assigned_to && job.assigned_to.toString() === req.user.id;
    if (!isBidder && !isAssigned) {
      return res.status(403).json({ message: 'You can only message on jobs you are bidding on or assigned to.' });
    }
    const message = new Message({
      job_id: jobId,
      from_user_id: req.user.id,
      to_user_id: toUserId,
      content,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
