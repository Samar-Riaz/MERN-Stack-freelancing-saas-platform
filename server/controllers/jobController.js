import Job from '../models/Job.js';
import Bid from '../models/Bid.js';

export const createJob = async (req, res) => {
  try {
    const { title, description, budget, deadline, category } = req.body;

    const job = await Job.create({
      title,
      description,
      budget,
      deadline,
      category,
      poster_id: req.user.id
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('CREATE JOB ERROR:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).sort('-createdAt');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ poster_id: req.user.id }).sort('-createdAt');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);
    
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    if (job.poster_id.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    job.status = status;
    await job.save();
    
    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
// Add this to your existing controller
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify admin or job owner
    if (job.poster_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.remove();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Enhanced getJobs for admin
export const getAdminJobs = async (req, res) => {
  try {
    const { status, limit } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (req.user.role === 'admin') {
      // Admins see all jobs
      const jobs = await Job.find(filter)
        .limit(parseInt(limit) || 10)
        .sort('-createdAt');
      res.json(jobs);
    } else {
      // Others see only their jobs (your existing getMyJobs)
      // ... keep your existing implementation
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to jobController.js
export const getJobStats = async (req, res) => {
  try {
    const stats = {
      total: await Job.countDocuments(),
      active: await Job.countDocuments({ status: 'active' }),
      completed: await Job.countDocuments({ status: 'completed' })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};