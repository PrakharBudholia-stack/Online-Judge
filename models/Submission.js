const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: String},
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  code: { type: String, required: true },
  status: {type: String},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);