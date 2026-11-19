'use strict';

require('dotenv').config();
const { createApp } = require('./app');

const PORT = process.env.PORT || 5000;
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`[API Response Kit Server] Listening on http://localhost:${PORT}`);
  console.log(`[Package Active] api-response-kit-kshitiz@1.0.0 (Zero Dependencies)`);
});

module.exports = server;
