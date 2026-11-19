'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { paginate, paginatedResponse } = require('../src');
test('paginate computes page metadata', () => {
  assert.deepEqual(paginate({ page: 2, limit: 10, total: 45 }), {
    page: 2, limit: 10, total: 45, totalPages: 5,
    hasNextPage: true, hasPreviousPage: true, nextPage: 3, previousPage: 1
  });
});
test('paginate handles empty collection', () => {
  const result = paginate({ total: 0 });
  assert.equal(result.totalPages, 0);
  assert.equal(result.nextPage, null);
  assert.equal(result.previousPage, null);
});
test('paginate handles page beyond last', () => {
  const result = paginate({ page: 9, limit: 10, total: 20 });
  assert.equal(result.hasNextPage, false);
  assert.equal(result.hasPreviousPage, true);
});
test('paginate calculates totalPages exactly at integer boundaries', () => {
  const total = Number.MAX_SAFE_INTEGER;
  const result = paginate({ page: 1, limit: 3, total });
  assert.equal(result.totalPages, Number((BigInt(total) + 2n) / 3n));
});
test('paginate validates inputs', () => {
  for (const options of [{ page: 0, total: 1 }, { limit: 0, total: 1 }, { total: -1 }, { total: 1.2 }, {}]) {
    assert.throws(() => paginate(options), RangeError);
  }
});
test('paginatedResponse combines results and metadata', () => {
  const result = paginatedResponse({ data: [{ id: 1 }], total: 1 });
  assert.equal(result.success, true);
  assert.equal(result.pagination.totalPages, 1);
  assert.deepEqual(result.data, [{ id: 1 }]);
});
test('paginatedResponse requires array', () => {
  assert.throws(() => paginatedResponse({ data: {}, total: 1 }), TypeError);
});
