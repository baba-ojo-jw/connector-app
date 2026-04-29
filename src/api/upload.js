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

// Configure file storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// POST /api/upload/avatar
router.post('/avatar', verifyToken, upload.single('photo'), async (req, res) => {

  // -------------------------------------------------------
  // VULNERABILITY: CVE-2023-0010 (MEDIUM — 6.7)
  // No Input Validation on Uploaded Files
  //
  // The server accepts ANY file type — there's no check on
  // file extension, MIME type, or file content.
  //
  // An attacker could upload a malicious script disguised
  // as a profile photo (e.g., "photo.jpg.exe" or a file
  // containing embedded code).
  //
  // There is also no file size limit configured.
  // -------------------------------------------------------

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Save file path to the user's profile — no validation performed
  const filePath = `/uploads/${req.file.filename}`;

  return res.json({
    message: 'Photo uploaded successfully',
    url: filePath
  });
});

module.exports = router;
