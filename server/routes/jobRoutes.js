import express from 'express';
import { 
  createJob, 
  getJobs, 
  getMyJobs, 
  updateJobStatus 
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createJob);
router.get('/', getJobs);
router.get('/my-jobs', protect, getMyJobs);
router.put('/:id/status', protect, updateJobStatus);

export default router;