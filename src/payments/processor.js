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

  // -------------------------------------------------------
  // VULNERABILITY: CVE-2023-0005 (CRITICAL — 9.1)
  // Unencrypted Payment Data in Transit
  //
  // Card numbers, expiry dates, and CVVs are sent over
  // an unencrypted HTTP connection (not HTTPS) during the
  // testing phase.
  //
  // Anyone on the same network can intercept this data
  // using basic network sniffing tools.
  //
  // CONTEXT: The payment feature is NOT yet live. No real
  // users are affected today. But this must be fixed before
  // the Q2 launch — investors are watching, and a breach
  // before launch could kill the funding round.
  // -------------------------------------------------------

  try {
    // Log the transaction (note: logging raw card data is also a problem)
    console.log(`Processing payment: card ending in ${cardNumber.slice(-4)}, amount: $${amount}`);

    // Store transaction record
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
