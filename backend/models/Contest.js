const mongoose = require('mongoose');

// Define the Contest schema
const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }]
});

// Create the Contest model
const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;
