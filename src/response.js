'use strict';

function validStatus(code, fallback) {
  if (code === undefined) return fallback;
  if (!Number.isInteger(code) || code < 100 || code > 599) {
    throw new RangeError('statusCode must be an integer between 100 and 599');
  }
  return code;
}

function success({ message = 'Success', data = null, statusCode = 200 } = {}) {
  validStatus(statusCode, 200);
  if (statusCode < 200 || statusCode >= 400) throw new RangeError('success statusCode must be 200–399');
  return { success: true, message, data, timestamp: new Date().toISOString() };
}

function error({ message = 'Internal Server Error', statusCode = 500, code = null, details = null } = {}) {
  validStatus(statusCode, 500);
  if (statusCode < 400) throw new RangeError('error statusCode must be 400–599');
  return { success: false, message, statusCode, code, details, timestamp: new Date().toISOString() };
}

module.exports = { success, error, validStatus };
