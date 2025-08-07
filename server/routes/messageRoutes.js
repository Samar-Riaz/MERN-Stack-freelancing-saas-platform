import express from 'express';
import Message from '../models/Message.js';
import { sendMessage, getJobMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/messages

// Get all messages for the logged-in user (inbox and sent)
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from_user_id: req.user.id },
        { to_user_id: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all conversations (distinct users) for the logged-in user
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [
        { from_user_id: userId },
        { to_user_id: userId }
      ]
    }).sort({ createdAt: -1 });

    // Get unique user IDs from conversations
    const users = new Set();
    messages.forEach(msg => {
      if (msg.from_user_id.toString() !== userId) users.add(msg.from_user_id.toString());
      if (msg.to_user_id.toString() !== userId) users.add(msg.to_user_id.toString());
    });
    res.json(Array.from(users));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, sendMessage);
router.get('/job/:jobId', protect, getJobMessages);

export default router;