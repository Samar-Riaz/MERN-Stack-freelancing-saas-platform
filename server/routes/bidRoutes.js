import express from 'express';
import { 
  createBid, 
  getBidsByJob, 
  getMyBids 
} from '../controllers/bidController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Support POST /bids/:jobId for bid creation
router.post('/:jobId', protect, (req, res) => {
  // Merge jobId from params into body for controller compatibility
  req.body.jobId = req.params.jobId;
  return createBid(req, res);
});
router.post('/', protect, createBid);
router.get('/job/:jobId', getBidsByJob);
router.get('/my-bids', protect, getMyBids);

export default router;