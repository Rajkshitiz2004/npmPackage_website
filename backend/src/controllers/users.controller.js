'use strict';

const {
  sendSuccess,
  sendError,
  paginatedResponse,
  ApiError
} = require('api-response-kit-kshitiz');
const { users } = require('../data/users');

function getAllUsers(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const search = (req.query.search || '').trim().toLowerCase();

  let filtered = users;
  if (search) {
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.department.toLowerCase().includes(search)
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
      message: 'Users fetched successfully'
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

function getUserById(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    throw new ApiError('Invalid user ID provided. Must be a positive integer.', 400, 'INVALID_USER_ID', { paramId: req.params.id });
  }

  const user = users.find(u => u.id === id);
  if (!user) {
    throw new ApiError(`User with ID ${id} was not found`, 404, 'USER_NOT_FOUND', { requestedId: id });
  }

  return sendSuccess(res, {
    message: `User details retrieved for ${user.name}`,
    data: user,
    statusCode: 200
  });
}

module.exports = {
  getAllUsers,
  getUserById
};
