'use strict';
// From this directory: npm install express
// This example uses the local source. In another project, use require('YOUR_PUBLISHED_PACKAGE_NAME').
const express = require('express');
const { sendSuccess, ApiError, asyncHandler, errorHandler } = require('../src');
const app = express();
app.get('/users/:id', asyncHandler(async (req, res) => {
  if (req.params.id !== '1') throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  return sendSuccess(res, { data: { id: 1, name: 'Rahul' }, message: 'User fetched' });
}));
app.use(errorHandler);
app.listen(3000, () => console.log('Visit http://localhost:3000/users/1'));
