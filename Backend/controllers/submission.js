const Submission = require('../models/submission');
const path = require('path');
const fs = require('fs');
// Controller to handle file upload and save submission record
exports.uploadDocument = async (req, res) => {
  try {
    console.log("Upload endpoint hit");
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { user, documentType } = req.body;
    if (!user || !documentType) {
      return res.status(400).json({ error: "Missing user or documentType" });
    }

    // Normalize file path to be relative to uploads folder for frontend use
    const relativeFilePath = path
      .relative(path.resolve(__dirname, '../'), req.file.path)
      .replace(/\\/g, '/');

    const submission = new Submission({
      user,
      documentType,
      filePath: '/' + relativeFilePath, // e.g. /uploads/filename.ext
      originalName: req.file.originalname,
      status: "Pending"
    });

    await submission.save();

    res.json({ message: 'File uploaded', filePath: submission.filePath, documentType });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to fetch submissions for a given user
exports.getUserSubmissions = async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({ error: "Missing user parameter" });
    }
    const submissions = await Submission.find({ user });
    res.json(submissions);
  } catch (err) {
    console.error("Get submissions error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    if (!submission) return res.status(404).json({ error: "Submission not found" });

    // Remove file from uploads folder
    const filePath = path.resolve(__dirname, '../', submission.filePath.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from MongoDB
    await Submission.findByIdAndDelete(id);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
