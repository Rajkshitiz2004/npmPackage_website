'use strict';

const {
  sendSuccess,
  sendError,
  paginatedResponse,
  ApiError
} = require('api-response-kit-kshitiz');
const { products } = require('../data/products');

function getAllProducts(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '8', 10);
  const category = (req.query.category || '').trim().toLowerCase();
  const search = (req.query.search || '').trim().toLowerCase();

  let filtered = products;
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category);
  }
  if (search) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  try {
    const startIndex = (page - 1) * limit;
    const items = startIndex < total ? filtered.slice(startIndex, startIndex + limit) : [];

    const result = paginatedResponse({
      data: items,
      page,
      limit,
      total,
      message: 'Product catalog fetched successfully'
    });

    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof RangeError || err instanceof TypeError) {
      return sendError(res, {
        message: err.message,
        statusCode: 400,
        code: 'INVALID_PAGINATION'
      });
    }
    throw err;
  }
}

function getProductById(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    throw new ApiError('Invalid product ID provided. Must be a positive integer.', 400, 'INVALID_PRODUCT_ID', { paramId: req.params.id });
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    throw new ApiError(`Product #${id} does not exist in our catalog`, 404, 'PRODUCT_NOT_FOUND', { requestedId: id });
  }

  return sendSuccess(res, {
    message: `Product details retrieved for ${product.title}`,
    data: product,
    statusCode: 200
  });
}

module.exports = {
  getAllProducts,
  getProductById
};
