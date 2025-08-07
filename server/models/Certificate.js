import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
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
  pdf_url: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;