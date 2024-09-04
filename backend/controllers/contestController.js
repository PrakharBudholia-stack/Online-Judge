const Contest = require('../models/Contest');

// Get all contests
exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find();
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get contest by ID
exports.getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new contest
exports.createContest = async (req, res) => {
  try {
    const newContest = new Contest(req.body);
    await newContest.save();
    res.status(201).json(newContest);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a contest
exports.updateContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a contest
exports.deleteContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndDelete(req.params.id);
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    res.json({ message: 'Contest deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
