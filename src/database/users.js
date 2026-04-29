/**
 * Database — User Records
 *
 * Manages user account data including registration
 * and password storage.
 */

const crypto = require('crypto');
const db = require('./queries');

/**
 * Create a new user account.
 */
async function createUser(username, email, password) {
  // -------------------------------------------------------
  // VULNERABILITY: CVE-2023-0007 (MEDIUM — 5.9)
  // Weak Password Hashing (MD5)
  //
  // Passwords are hashed using MD5, which is fast to compute
  // and has known weaknesses. An attacker who gains access
  // to the database can crack MD5 hashes quickly using
  // precomputed tables (rainbow tables).
  //
  // Modern apps use bcrypt or argon2, which are intentionally
  // slow and resistant to brute-force attacks.
  //
  // Note: The database is internal-only, but if an attacker
  // gains access through another vulnerability (like the SQL
  // injection in queries.js), the weak hashing makes it
  // trivial to recover plaintext passwords.
  // -------------------------------------------------------
  const hashedPassword = crypto
    .createHash('md5')
    .update(password)
    .digest('hex');

  const result = await db.query(
    'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, username, email',
    [username, email, hashedPassword]
  );

  return result[0];
}

/**
 * Verify a user's password during login.
 */
async function verifyPassword(username, password) {
  const user = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (!user || user.length === 0) return null;

  // Hash the provided password with MD5 and compare
  const hash = crypto
    .createHash('md5')
    .update(password)
    .digest('hex');

  if (hash === user[0].password_hash) {
    return user[0];
  }

  return null;
}

module.exports = { createUser, verifyPassword };
