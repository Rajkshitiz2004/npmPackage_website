'use strict';

const { errorHandler } = require('api-response-kit-kshitiz');

// We use the package's built-in errorHandler directly.
// This wrapper ensures consistent Express integration and clean error forwarding.
module.exports = errorHandler;
