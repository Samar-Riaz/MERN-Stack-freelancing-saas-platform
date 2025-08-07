import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bid_amount: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;