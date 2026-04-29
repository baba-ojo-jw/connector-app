/**
 * Backend API — Search
 *
 * Handles searching for users and posts.
 * ~18,000 requests/day.
 */

const express = require('express');
const router = express.Router();
const db = require('../database/queries');
const { verifyToken } = require('../auth/session');

// GET /api/search?q=...
router.get('/search', verifyToken, async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Search users
    const users = await db.query(
      'SELECT id, username, display_name FROM users WHERE username ILIKE $1 OR display_name ILIKE $1 LIMIT 20',
      [`%${q}%`]
    );

    // Search posts
    const posts = await db.query(
      'SELECT id, author_id, content, created_at FROM posts WHERE content ILIKE $1 ORDER BY created_at DESC LIMIT 20',
      [`%${q}%`]
    );

    return res.json({ users, posts });

  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
