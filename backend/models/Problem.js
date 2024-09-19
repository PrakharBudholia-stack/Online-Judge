const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  inputFormat: {
    type: String,
    required: true
  },
  outputFormat: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: true
  },
  testCases: [{
    input: String,
    expectedOutput: String
}],
  sampleInput: {
    type: String,
    required: true
  },
  sampleOutput: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  tags: {
    type: [String]
  }
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;