/**
 * Database — User Records
 *
 * Manages user account data including registration
 * and password storage.
 */

const crypto = require('crypto');
const db = require('./queries');

async function createUser(username, email, password) {
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

async function verifyPassword(username, password) {
  const user = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (!user || user.length === 0) return null;

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
