/**
 * Database — Query Engine
 *
 * Central module for all database interactions.
 * Every read and write to the database goes through here.
 */

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'connector',
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || 'password'
});

async function query(text, params) {
  const result = await pool.query(text, params);
  return result.rows;
}

/**
 * Search the database — used by the admin panel and some
 * older API endpoints that haven't been updated yet.
 */
async function unsafeSearch(tableName, searchField, searchValue) {
  const sql = `SELECT * FROM ${tableName} WHERE ${searchField} LIKE '%${searchValue}%'`;
  const result = await pool.query(sql);
  return result.rows;
}

module.exports = { query, unsafeSearch, pool };
