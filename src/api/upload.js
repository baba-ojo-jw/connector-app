/**
 * Backend API — File Upload
 *
 * Handles profile photo and file uploads.
 * ~6,500 requests/day.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../auth/session');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// POST /api/upload/avatar
router.post('/avatar', verifyToken, upload.single('photo'), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = `/uploads/${req.file.filename}`;

  return res.json({
    message: 'Photo uploaded successfully',
    url: filePath
  });
});

module.exports = router;
