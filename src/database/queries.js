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

/**
 * Execute a database query.
 */
async function query(text, params) {
  const result = await pool.query(text, params);
  return result.rows;
}

// -------------------------------------------------------
// VULNERABILITY: CVE-2023-0002 (HIGH — 8.1)
// SQL Injection
//
// The function below builds a SQL query by directly
// inserting user input into the query string. An attacker
// can craft a request that modifies the query to read,
// change, or delete data from the entire database.
//
// Example attack: searching for ' OR 1=1; DROP TABLE users; --
// would delete the entire users table.
// -------------------------------------------------------

/**
 * Search the database — used by the admin panel and some
 * older API endpoints that haven't been updated yet.
 */
async function unsafeSearch(tableName, searchField, searchValue) {
  // BAD: User input is concatenated directly into the SQL string
  const sql = `SELECT * FROM ${tableName} WHERE ${searchField} LIKE '%${searchValue}%'`;
  const result = await pool.query(sql);
  return result.rows;
}

module.exports = { query, unsafeSearch, pool };
