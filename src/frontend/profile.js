/**
 * Frontend — Profile Page
 *
 * Renders user profile pages. ~35,000 requests/day,
 * surged after a recent viral post.
 */

const express = require('express');
const router = express.Router();
const db = require('../database/queries');

// GET /profile/:username
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await db.query(
      'SELECT id, username, display_name, bio, avatar_url FROM users WHERE username = $1',
      [username]
    );

    if (!user || user.length === 0) {
      return res.status(404).send('<h1>User not found</h1>');
    }

    const profile = user[0];

    const html = `
      <html>
        <head><title>${profile.display_name} — Connector</title></head>
        <body>
          <div class="profile-card">
            <img src="${profile.avatar_url}" alt="Avatar" />
            <h1>${profile.display_name}</h1>
            <p>${profile.bio}</p>
            <p>@${profile.username}</p>
          </div>
        </body>
      </html>
    `;

    return res.send(html);

  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).send('<h1>Something went wrong</h1>');
  }
});

module.exports = router;
