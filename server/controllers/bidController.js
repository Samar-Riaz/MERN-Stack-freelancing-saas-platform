import Bid from '../models/Bid.js';
import Job from '../models/Job.js';

export const createBid = async (req, res) => {
  try {
    // Debug: log incoming body
    console.log('CREATE BID BODY:', req.body);
    const { jobId, bid_amount, amount, message, timeline } = req.body;
    const bidAmount = bid_amount !== undefined ? bid_amount : amount;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    if (job.status !== 'open') return res.status(400).json({ msg: 'Job is not open for bidding' });

    const existingBid = await Bid.findOne({ job_id: jobId, user_id: req.user.id });
    if (existingBid) return res.status(400).json({ msg: 'You already bid on this job' });

    const bid = await Bid.create({
      job_id: jobId,
      user_id: req.user.id,
      bid_amount: bidAmount,
      message,
      timeline
    });

    res.status(201).json(bid);
  } catch (err) {
    console.error('CREATE BID ERROR:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getBidsByJob = async (req, res) => {
  try {
    const bids = await Bid.find({ job_id: req.params.jobId })
      .populate('user_id', 'name rating')
      .sort('-createdAt');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ user_id: req.user.id })
      .populate('job_id', 'title budget deadline status')
      .sort('-createdAt');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};