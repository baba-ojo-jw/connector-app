/**
 * Admin Panel — Admin Login
 *
 * Handles authentication for the internal admin dashboard.
 * Only used by staff. ~12 requests/day.
 */

const express = require('express');
const router = express.Router();
const db = require('../database/queries');

// POST /admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await db.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    if (!admin || admin.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (admin[0].password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({
      message: 'Admin login successful',
      admin: { id: admin[0].id, username: admin[0].username, role: admin[0].role }
    });

  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
