// models/Question.js
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

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
  },
  sampleTestCases: {
    type: [testCaseSchema],
    required: true,
  },
  hiddenTestCasesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HiddenTestCases',
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;