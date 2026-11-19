'use strict';

require('dotenv').config();
const { createApp } = require('./app');

const PORT = process.env.PORT || 5001;
const app = createApp();

// When running as a standalone server (local development)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`[API Response Kit Server] Listening on http://localhost:${PORT}`);
    console.log(`[Package Active] api-response-kit-kshitiz@1.0.0 (Zero Dependencies)`);
  });
  module.exports = server;
} else {
  // Export the Express app instance for Vercel Serverless / integration tests
  module.exports = app;
}
