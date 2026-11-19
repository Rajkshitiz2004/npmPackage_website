'use strict';
const { success } = require('./response');

function paginate({ page = 1, limit = 10, total } = {}) {
  if (!Number.isSafeInteger(page) || page < 1) throw new RangeError('page must be a positive safe integer');
  if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError('limit must be a positive safe integer');
  if (!Number.isSafeInteger(total) || total < 0) throw new RangeError('total must be a non-negative safe integer');
  const totalPages = total === 0
    ? 0
    : Number((BigInt(total) + BigInt(limit) - 1n) / BigInt(limit));
  return {
    page, limit, total, totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && totalPages > 0,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 && totalPages > 0 ? page - 1 : null
  };
}

function paginatedResponse({ data, page = 1, limit = 10, total, message = 'Success' } = {}) {
  if (!Array.isArray(data)) throw new TypeError('data must be an array');
  return { ...success({ message, data }), pagination: paginate({ page, limit, total }) };
}
module.exports = { paginate, paginatedResponse };
