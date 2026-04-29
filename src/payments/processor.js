/**
 * Payment Processor — Transaction Handler
 *
 * Handles payment processing for premium features.
 * STATUS: Not yet live — still in testing phase.
 * Traffic: 0 requests/day (no production traffic).
 */

const express = require('express');
const router = express.Router();
const db = require('../database/queries');
const { verifyToken } = require('../auth/session');

// POST /payments/charge
router.post('/charge', verifyToken, async (req, res) => {
  const { cardNumber, expiry, cvv, amount } = req.body;

  try {
    console.log(`Processing payment: card ending in ${cardNumber.slice(-4)}, amount: $${amount}`);

    const transaction = await db.query(
      'INSERT INTO transactions (user_id, amount, card_last_four, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [req.user.userId, amount, cardNumber.slice(-4), 'completed']
    );

    return res.json({
      message: 'Payment processed',
      transaction: transaction[0]
    });

  } catch (err) {
    console.error('Payment error:', err);
    return res.status(500).json({ error: 'Payment failed' });
  }
});

module.exports = router;
