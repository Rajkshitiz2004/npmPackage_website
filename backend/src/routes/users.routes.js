'use strict';

const express = require('express');
const { asyncHandler } = require('api-response-kit-kshitiz');
const { getAllUsers, getUserById } = require('../controllers/users.controller');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', asyncHandler(getUserById));

module.exports = router;
