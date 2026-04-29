/**
 * Frontend — Error Handler
 *
 * Global error handling for the Connector app.
 * Displays error pages when something goes wrong.
 */

function errorHandler(err, req, res, next) {
  console.error('Application error:', err);

  const statusCode = err.statusCode || 500;

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
