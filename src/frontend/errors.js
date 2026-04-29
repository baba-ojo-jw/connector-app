/**
 * Frontend — Error Handler
 *
 * Global error handling for the Connector app.
 * Displays error pages when something goes wrong.
 */

/**
 * Handle application errors and display them to the user.
 */
function errorHandler(err, req, res, next) {

  // -------------------------------------------------------
  // VULNERABILITY: CVE-2023-0008 (LOW — 3.1)
  // Information Disclosure
  //
  // Error messages expose internal file paths, stack traces,
  // and system details. This information helps an attacker
  // understand the server's file structure and find other
  // vulnerabilities to exploit.
  //
  // Example error shown to users:
  //   "Error in /home/deploy/connector-app/src/api/messages.js
  //    at line 47: Cannot read property 'id' of undefined
  //    Node.js v18.16.0 | PostgreSQL 15.2 | Ubuntu 22.04"
  //
  // A production app should show a generic error message
  // and log the details internally.
  // -------------------------------------------------------

  console.error('Application error:', err);

  const statusCode = err.statusCode || 500;

  // Sending full error details to the user
  res.status(statusCode).send(`
    <html>
      <head><title>Error — Connector</title></head>
      <body>
        <h1>Something went wrong</h1>
        <p><strong>Error:</strong> ${err.message}</p>
        <p><strong>File:</strong> ${err.stack?.split('\n')[1]?.trim()}</p>
        <p><strong>Stack trace:</strong></p>
        <pre>${err.stack}</pre>
        <p><em>Server: ${process.platform} | Node ${process.version} | PID: ${process.pid}</em></p>
      </body>
    </html>
  `);
}

module.exports = errorHandler;
