const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Store user ID or username
  documentType: { type: String, required: true },
  filePath: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
});

module.exports = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
