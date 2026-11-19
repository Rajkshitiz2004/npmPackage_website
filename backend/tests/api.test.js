'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createApp } = require('../src/app');

let server;
let baseUrl;

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('1. GET /api/health returns standardized health response', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.status, 'UP');
  assert.equal(data.data.package.name, 'api-response-kit-kshitiz');
  assert.ok(data.timestamp);
});

test('2. GET /api/demo/success returns standardized success response', async () => {
  const res = await fetch(`${baseUrl}/api/demo/success`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(typeof data.message, 'string');
  assert.equal(data.data.name, 'Kshitiz Raj');
  assert.ok(data.timestamp);
});

test('3. GET /api/demo/error returns standardized error responses', async () => {
  // Test 404
  const res404 = await fetch(`${baseUrl}/api/demo/error?status=404`);
  assert.equal(res404.status, 404);
  const data404 = await res404.json();
  assert.equal(data404.success, false);
  assert.equal(data404.statusCode, 404);
  assert.equal(data404.code, 'RESOURCE_NOT_FOUND');
  assert.ok(data404.timestamp);

  // Test 401
  const res401 = await fetch(`${baseUrl}/api/demo/error?status=401`);
  assert.equal(res401.status, 401);
  const data401 = await res401.json();
  assert.equal(data401.success, false);
  assert.equal(data401.statusCode, 401);
  assert.equal(data401.code, 'UNAUTHORIZED_ACCESS');

  // Test 422
  const res422 = await fetch(`${baseUrl}/api/demo/error?status=422`);
  assert.equal(res422.status, 422);
  const data422 = await res422.json();
  assert.equal(data422.success, false);
  assert.equal(data422.statusCode, 422);
});

test('4. GET /api/demo/pagination calculates valid pagination metadata', async () => {
  const res = await fetch(`${baseUrl}/api/demo/pagination?page=2&limit=10&total=45`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  const meta = body.data;
  assert.equal(meta.page, 2);
  assert.equal(meta.limit, 10);
  assert.equal(meta.total, 45);
  assert.equal(meta.totalPages, 5);
  assert.equal(meta.hasNextPage, true);
  assert.equal(meta.hasPreviousPage, true);
  assert.equal(meta.nextPage, 3);
  assert.equal(meta.previousPage, 1);
});

test('5. GET /api/demo/pagination gracefully handles invalid pagination inputs', async () => {
  const res = await fetch(`${baseUrl}/api/demo/pagination?page=-1&limit=10&total=45`);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.statusCode, 400);
  assert.equal(body.code, 'INVALID_PAGINATION_PARAMS');
});

test('6. GET /api/demo/users returns paginated list of users', async () => {
  const res = await fetch(`${baseUrl}/api/demo/users?page=1&limit=10`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.equal(body.data.length, 10);
  assert.ok(body.pagination);
  assert.equal(body.pagination.page, 1);
  assert.equal(body.pagination.limit, 10);
  assert.equal(body.pagination.total, 60);
  assert.equal(body.pagination.totalPages, 6);
  assert.equal(body.pagination.hasNextPage, true);
});

test('7. GET /api/demo/express demonstrates Express helper integration', async () => {
  const resSuccess = await fetch(`${baseUrl}/api/demo/express?type=success`);
  assert.equal(resSuccess.status, 200);
  const bodySuccess = await resSuccess.json();
  assert.equal(bodySuccess.success, true);

  const resError = await fetch(`${baseUrl}/api/demo/express?type=error`);
  assert.equal(resError.status, 400);
  const bodyError = await resError.json();
  assert.equal(bodyError.success, false);
  assert.equal(bodyError.statusCode, 400);
});

test('8. GET /api/demo/async-error tests asyncHandler and ApiError', async () => {
  const resApiError = await fetch(`${baseUrl}/api/demo/async-error?mode=apierror`);
  assert.equal(resApiError.status, 403);
  const bodyApiError = await resApiError.json();
  assert.equal(bodyApiError.success, false);
  assert.equal(bodyApiError.statusCode, 403);
  assert.equal(bodyApiError.code, 'ACCOUNT_SUSPENDED');
  assert.ok(bodyApiError.details);

  // Unexpected native error masked as 500
  const resUnexpected = await fetch(`${baseUrl}/api/demo/async-error?mode=unexpected`);
  assert.equal(resUnexpected.status, 500);
  const bodyUnexpected = await resUnexpected.json();
  assert.equal(bodyUnexpected.success, false);
  assert.equal(bodyUnexpected.statusCode, 500);
  assert.equal(bodyUnexpected.message, 'Internal Server Error');
  // Internal stack trace details should NOT leak
  assert.equal(bodyUnexpected.details, null);
});

test('9. GET /api/users/:id tests fetching single user and 404', async () => {
  const resUser = await fetch(`${baseUrl}/api/users/1`);
  assert.equal(resUser.status, 200);
  const bodyUser = await resUser.json();
  assert.equal(bodyUser.success, true);
  assert.equal(bodyUser.data.id, 1);

  const resNotFound = await fetch(`${baseUrl}/api/users/9999`);
  assert.equal(resNotFound.status, 404);
  const bodyNotFound = await resNotFound.json();
  assert.equal(bodyNotFound.success, false);
  assert.equal(bodyNotFound.code, 'USER_NOT_FOUND');
});

test('10. GET /api/products tests paginated products catalog', async () => {
  const res = await fetch(`${baseUrl}/api/products?page=1&limit=5`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.length, 5);
  assert.equal(body.pagination.total, 30);
  assert.equal(body.pagination.totalPages, 6);
});

test('11. POST /api/demo/auth/login tests authentication simulation', async () => {
  // Missing fields
  const resMissing = await fetch(`${baseUrl}/api/demo/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.equal(resMissing.status, 400);

  // Invalid credentials
  const resInvalid = await fetch(`${baseUrl}/api/demo/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'wrong@test.com', password: 'bad' })
  });
  assert.equal(resInvalid.status, 401);

  // Successful login
  const resSuccess = await fetch(`${baseUrl}/api/demo/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@devflow.io', password: 'devkit123' })
  });
  assert.equal(resSuccess.status, 200);
  const bodySuccess = await resSuccess.json();
  assert.equal(bodySuccess.success, true);
  assert.ok(bodySuccess.data.token);
});
