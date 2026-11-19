'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { success, error, sendSuccess, sendError, ApiError, asyncHandler, errorHandler } = require('../src');
function mockRes() {
  return { headersSent: false, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
test('success uses defaults and ISO timestamp', () => {
  const result = success();
  assert.equal(result.success, true);
  assert.equal(result.message, 'Success');
  assert.equal(result.data, null);
  assert.ok(!Number.isNaN(Date.parse(result.timestamp)));
});
test('success preserves custom data and message', () => {
  assert.deepEqual(success({ message: 'OK', data: [1] }).data, [1]);
});
test('success rejects invalid status', () => {
  assert.throws(() => success({ statusCode: 404 }), RangeError);
  assert.throws(() => success({ statusCode: 200.5 }), RangeError);
});
test('error produces consistent error body', () => {
  const result = error({ message: 'Missing', statusCode: 404, code: 'NOT_FOUND', details: { id: 2 } });
  assert.equal(result.success, false);
  assert.equal(result.code, 'NOT_FOUND');
  assert.equal(result.statusCode, 404);
  assert.deepEqual(result.details, { id: 2 });
});
test('error rejects success status', () => {
  assert.throws(() => error({ statusCode: 200 }), RangeError);
});
test('sendSuccess writes HTTP response', () => {
  const res = mockRes();
  assert.equal(sendSuccess(res, { statusCode: 201, data: { id: 1 } }), res);
  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body.data, { id: 1 });
});
test('sendError writes HTTP response', () => {
  const res = mockRes();
  sendError(res, { statusCode: 422, message: 'Invalid' });
  assert.equal(res.statusCode, 422);
  assert.equal(res.body.message, 'Invalid');
});
test('ApiError stores status and metadata', () => {
  const err = new ApiError('No access', 403, 'FORBIDDEN');
  assert.equal(err.statusCode, 403);
  assert.equal(err.code, 'FORBIDDEN');
});
test('asyncHandler forwards rejected promises', async () => {
  const failure = new Error('failure');
  let caught;
  const wrapped = asyncHandler(async () => { throw failure; });
  await wrapped({}, {}, err => { caught = err; });
  assert.equal(caught, failure);
});
test('asyncHandler forwards synchronous exceptions', () => {
  let caught;
  asyncHandler(() => { throw new Error('sync'); })({}, {}, err => { caught = err; });
  assert.equal(caught.message, 'sync');
});
test('errorHandler exposes ApiError but hides unexpected error', () => {
  const known = mockRes();
  errorHandler(new ApiError('Not found', 404), {}, known, () => {});
  assert.equal(known.body.message, 'Not found');
  const unknown = mockRes();
  errorHandler(new Error('secret'), {}, unknown, () => {});
  assert.equal(unknown.body.message, 'Internal Server Error');
});
test('errorHandler delegates if headers already sent', () => {
  const res = mockRes(); res.headersSent = true;
  const err = new Error('late'); let passed;
  errorHandler(err, {}, res, e => { passed = e; });
  assert.equal(passed, err);
});
