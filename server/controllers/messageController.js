import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { jobId, toUserId, content } = req.body;

    const message = await Message.create({
      job_id: jobId,
      from_user_id: req.user.id,
      to_user_id: toUserId,
      content
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('SEND MESSAGE ERROR:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getJobMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      job_id: req.params.jobId,
      $or: [
        { from_user_id: req.user.id },
        { to_user_id: req.user.id }
      ]
    }).sort('createdAt');
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};