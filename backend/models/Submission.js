const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'cpp'],
    required: true
  },
  input: {
    type: String
  },
  output: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  executionTime: {
    type: Number
  }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;