const mongoose = require('mongoose');

// Define the Problem schema
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
  inputs: {
    type: [String],
    required: true
  },
  outputs: {
    type: [String],
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

// Create the Problem model
const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
