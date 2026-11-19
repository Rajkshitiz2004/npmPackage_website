'use strict';
const { success, error } = require('./response');

function sendSuccess(res, { message = 'Success', data = null, statusCode = 200 } = {}) {
  const body = success({ message, data, statusCode });
  return res.status(statusCode).json(body);
}

function sendError(res, { message = 'Internal Server Error', statusCode = 500, code = null, details = null } = {}) {
  const body = error({ message, statusCode, code, details });
  return res.status(statusCode).json(body);
}

class ApiError extends Error {
  constructor(message, statusCode = 500, code = null, details = null) {
    error({ message, statusCode, code, details });
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

function asyncHandler(fn) {
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  return function wrapped(req, res, next) {
    try { return Promise.resolve(fn(req, res, next)).catch(next); }
    catch (err) { return next(err); }
  };
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const isApiError = err instanceof ApiError;
  return sendError(res, {
    message: isApiError ? err.message : 'Internal Server Error',
    statusCode: isApiError ? err.statusCode : 500,
    code: isApiError ? err.code : null,
    details: isApiError ? err.details : null
  });
}
module.exports = { sendSuccess, sendError, ApiError, asyncHandler, errorHandler };
