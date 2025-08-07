import express from 'express';
import { 
  createTask, 
  updateTaskStatus, 
  getJobTasks 
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask);
router.put('/:id/status', protect, updateTaskStatus);
router.get('/job/:jobId', protect, getJobTasks);

export default router;