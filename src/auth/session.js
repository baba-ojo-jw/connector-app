/**
 * Authentication Service — Session Manager
 *
 * Manages session tokens for authenticated users.
 * Every API request is checked against this module.
 */

const jwt = require('jsonwebtoken');

// In-memory store of active sessions
const activeSessions = new Map();

/**
 * Verify a session token from an incoming request.
 */
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    req.user = decoded;

    // Track the session
    activeSessions.set(decoded.userId, {
      token: token,
      lastActive: new Date()
    });

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// -------------------------------------------------------
// VULNERABILITY: CVE-2023-0009 (HIGH — 8.5)
// Non-Expiring Session Tokens
//
// Tokens never expire. Once a token is created at login,
// it remains valid forever — even after the user logs out.
//
// If an attacker steals a token (e.g., from a public Wi-Fi
// network), they have permanent access to that account.
//
// The logout function below removes the token from our
// in-memory store, but the token itself is still valid
// and can be used from any other device.
// -------------------------------------------------------

function logout(req, res) {
  const userId = req.user.userId;

  // Remove from our tracking — but the JWT is still valid!
  // There is no expiration and no token blacklist.
  activeSessions.delete(userId);

  return res.json({ message: 'Logged out successfully' });
}

function getActiveSessions() {
  return activeSessions.size;
}

module.exports = { verifyToken, logout, getActiveSessions };
