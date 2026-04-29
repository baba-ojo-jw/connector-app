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

  // -------------------------------------------------------
  // VULNERABILITY: CVE-2023-0004 (MEDIUM — 6.2)
  // Missing Rate Limiting on Admin Login
  //
  // There is no limit on login attempts. An attacker can
  // try thousands of password combinations per minute
  // (brute-force attack) to guess an admin password.
  //
  // Most login systems lock the account or add a delay
  // after 5-10 failed attempts. This one doesn't.
  //
  // CONTEXT: The admin panel only gets ~12 requests/day
  // from internal staff. But if an attacker finds this
  // endpoint, they can hammer it indefinitely.
  // -------------------------------------------------------

  try {
    const admin = await db.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    if (!admin || admin.length === 0) {
      // No delay, no lockout, no attempt tracking
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (admin[0].password !== password) {
      // Same — no delay, no lockout, no attempt tracking
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
