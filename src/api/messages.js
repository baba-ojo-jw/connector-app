/**
 * Backend API — Direct Messages
 *
 * Handles sending and reading direct messages between users.
 * One of the busiest endpoints: ~28,000 requests/day and growing.
 */

const express = require('express');
const router = express.Router();
const db = require('../database/queries');
const { verifyToken } = require('../auth/session');

// GET /api/messages/:conversationId
router.get('/messages/:conversationId', verifyToken, async (req, res) => {
  const { conversationId } = req.params;

  // -------------------------------------------------------
  // VULNERABILITY: CVE-2023-0006 (HIGH — 7.8)
  // Broken Access Control
  //
  // This endpoint does NOT check whether the logged-in user
  // is actually a participant in this conversation.
  //
  // Any authenticated user can read ANY conversation by
  // simply changing the conversation ID in the URL.
  //
  // Example: User A requests /api/messages/user-b-and-c
  // and can read User B and C's private messages.
  // -------------------------------------------------------
  try {
    const messages = await db.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at DESC',
      [conversationId]
    );

    return res.json({ messages });

  } catch (err) {
    console.error('Error fetching messages:', err);
    return res.status(500).json({ error: 'Failed to load messages' });
  }
});

// POST /api/messages/:conversationId
router.post('/messages/:conversationId', verifyToken, async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;
  const senderId = req.user.userId;

  // -------------------------------------------------------
  // VULNERABILITY: CVE-2023-0012 (HIGH — 7.2)
  // No Rate Limiting
  //
  // There is no limit on how many messages a user can send.
  // An attacker could flood this endpoint with thousands of
  // requests per second, overwhelming the server and causing
  // it to crash for ALL users (denial of service).
  //
  // No rate limiting exists on any API endpoint.
  // -------------------------------------------------------
  try {
    const newMessage = await db.query(
      'INSERT INTO messages (conversation_id, sender_id, text, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [conversationId, senderId, text]
    );

    return res.status(201).json({ message: newMessage });

  } catch (err) {
    console.error('Error sending message:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
