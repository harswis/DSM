const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadDocument, getUserSubmissions } = require('../controllers/submission');
const { deleteSubmission } = require('../controllers/submission');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/user-submissions', getUserSubmissions);

router.delete('/delete/:id', deleteSubmission);//deletion

module.exports = router;
