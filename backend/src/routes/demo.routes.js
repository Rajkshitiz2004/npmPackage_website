'use strict';

const express = require('express');
const { asyncHandler } = require('api-response-kit-kshitiz');
const {
  getSuccessDemo,
  getErrorDemo,
  getPaginationDemo,
  getUsersPaginatedDemo,
  getExpressHelperDemo,
  getAsyncErrorDemo,
  postAuthLoginDemo
} = require('../controllers/demo.controller');

const router = express.Router();

router.get('/success', getSuccessDemo);
router.get('/error', getErrorDemo);
router.get('/pagination', getPaginationDemo);
router.get('/users', getUsersPaginatedDemo);
router.get('/express', getExpressHelperDemo);
router.get('/async-error', asyncHandler(getAsyncErrorDemo));
router.post('/auth/login', postAuthLoginDemo);

module.exports = router;
