// models/HiddenTestCases.js
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

const hiddenTestCasesSchema = new mongoose.Schema({
  testCases: {
    type: [testCaseSchema],
    required: true,
  },
});

const HiddenTestCases = mongoose.model('HiddenTestCases', hiddenTestCasesSchema);

module.exports = HiddenTestCases;