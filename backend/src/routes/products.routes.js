'use strict';

const express = require('express');
const { asyncHandler } = require('api-response-kit-kshitiz');
const { getAllProducts, getProductById } = require('../controllers/products.controller');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', asyncHandler(getProductById));

module.exports = router;
