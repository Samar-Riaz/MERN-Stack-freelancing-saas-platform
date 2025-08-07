import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const { jobId, title } = req.body;

    const task = await Task.create({
      job_id: jobId,
      title,
      assigned_user_id: req.user.id
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('CREATE TASK ERROR:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    task.status = status;
    await task.save();
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getJobTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ job_id: req.params.jobId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};