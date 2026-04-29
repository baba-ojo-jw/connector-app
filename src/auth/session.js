/**
 * Authentication Service — Session Manager
 *
 * Manages session tokens for authenticated users.
 * Every API request is checked against this module.
 */

const jwt = require('jsonwebtoken');

const activeSessions = new Map();

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    req.user = decoded;

    activeSessions.set(decoded.userId, {
      token: token,
      lastActive: new Date()
    });

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function logout(req, res) {
  const userId = req.user.userId;

  activeSessions.delete(userId);

  return res.json({ message: 'Logged out successfully' });
}

function getActiveSessions() {
  return activeSessions.size;
}

module.exports = { verifyToken, logout, getActiveSessions };
