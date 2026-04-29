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
