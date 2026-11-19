'use strict';

const {
  success,
  error,
  paginate,
  paginatedResponse,
  sendSuccess,
  sendError,
  ApiError
} = require('api-response-kit-kshitiz');
const { users } = require('../data/users');

// Scenario A: Standardized Success
function getSuccessDemo(req, res) {
  const sampleUser = {
    userId: 'usr_8923a1',
    name: 'Kshitiz Raj',
    email: 'kshitiz@devflow.io',
    role: 'Lead Architect',
    organization: 'API Response Kit Labs',
    lastLogin: new Date().toISOString()
  };

  // Uses package's sendSuccess helper
  return sendSuccess(res, {
    message: 'User profile retrieved successfully',
    data: sampleUser,
    statusCode: 200
  });
}

// Scenario B: Standardized Error
function getErrorDemo(req, res) {
  const statusParam = parseInt(req.query.status || '404', 10);
  const statusCodes = {
    400: { message: 'Invalid payload: required field "email" is missing or malformed', code: 'VALIDATION_ERROR', details: { field: 'email', issue: 'must be valid RFC5322 address' } },
    401: { message: 'Authentication required. Missing Bearer token in Authorization header.', code: 'UNAUTHORIZED_ACCESS', details: null },
    403: { message: 'Insufficient permissions. Organization administrator role required.', code: 'FORBIDDEN_RESOURCE', details: { requiredRole: 'admin', currentRole: 'member' } },
    404: { message: 'The requested resource "/api/v1/sessions/sess_9901" was not found', code: 'RESOURCE_NOT_FOUND', details: { resourceId: 'sess_9901' } },
    422: { message: 'Semantic validation failed: username contains reserved profanity tokens', code: 'UNPROCESSABLE_ENTITY', details: { field: 'username', rule: 'blacklist_check' } },
    500: { message: 'Internal Server Error: Database cluster connection timed out', code: 'DATABASE_TIMEOUT', details: null }
  };

  const preset = statusCodes[statusParam] || statusCodes[404];
  const statusCode = statusCodes[statusParam] ? statusParam : 404;

  // Uses package's sendError helper
  return sendError(res, {
    message: preset.message,
    statusCode: statusCode,
    code: preset.code,
    details: preset.details
  });
}

// Scenario C: Pure Pagination Calculation
function getPaginationDemo(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const total = parseInt(req.query.total !== undefined ? req.query.total : '45', 10);

  try {
    // Uses package's paginate function directly
    const paginationMeta = paginate({ page, limit, total });
    return sendSuccess(res, {
      message: 'Pagination metadata calculated successfully',
      data: paginationMeta,
      statusCode: 200
    });
  } catch (err) {
    if (err instanceof RangeError) {
      return sendError(res, {
        message: err.message,
        statusCode: 400,
        code: 'INVALID_PAGINATION_PARAMS',
        details: { page, limit, total }
      });
    }
    throw err;
  }
}

// Scenario D: Paginated in-memory dataset
function getUsersPaginatedDemo(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const search = (req.query.search || '').trim().toLowerCase();
  const role = (req.query.role || '').trim();

  let filtered = users;
  if (search) {
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.department.toLowerCase().includes(search)
    );
  }
  if (role) {
    filtered = filtered.filter(u => u.role.toLowerCase() === role.toLowerCase());
  }

  const total = filtered.length;

  try {
    const startIndex = (page - 1) * limit;
    const pageItems = startIndex < total ? filtered.slice(startIndex, startIndex + limit) : [];

    // Uses package's paginatedResponse helper
    const responsePayload = paginatedResponse({
      data: pageItems,
      page,
      limit,
      total,
      message: `Retrieved ${pageItems.length} user record(s)`
    });

    return res.status(200).json(responsePayload);
  } catch (err) {
    if (err instanceof RangeError || err instanceof TypeError) {
      return sendError(res, {
        message: err.message,
        statusCode: 400,
        code: 'PAGINATION_QUERY_ERROR'
      });
    }
    throw err;
  }
}

// Scenario E: Express Helpers Demonstration
function getExpressHelperDemo(req, res) {
  const type = req.query.type || 'success';

  if (type === 'error') {
    return sendError(res, {
      message: 'sendError() called directly with Express res object',
      statusCode: 400,
      code: 'EXPRESS_HELPER_ERROR_DEMO',
      details: {
        helper: 'sendError(res, options)',
        httpStatusSent: 400
      }
    });
  }

  return sendSuccess(res, {
    message: 'sendSuccess() automatically sets HTTP status code and JSON payload',
    data: {
      helper: 'sendSuccess(res, options)',
      statusWritten: 200,
      integratedWith: 'Express.js Response Pipeline'
    },
    statusCode: 200
  });
}

// Scenario F: Async Error with asyncHandler and ApiError
async function getAsyncErrorDemo(req, res) {
  const mode = req.query.mode || 'apierror';

  // Simulating an asynchronous database or service operation
  await new Promise(resolve => setTimeout(resolve, 30));

  if (mode === 'apierror') {
    // Throws package's ApiError instance
    throw new ApiError(
      'Target user account [usr_9901] is suspended or deactivated',
      403,
      'ACCOUNT_SUSPENDED',
      { accountId: 'usr_9901', suspensionReason: 'Terms of service violation' }
    );
  }

  if (mode === 'notfound') {
    throw new ApiError(
      'Requested payment transaction id "tx_881923" not found',
      404,
      'TRANSACTION_NOT_FOUND',
      { transactionId: 'tx_881923' }
    );
  }

  // mode === 'unexpected'
  // Simulates an unhandled native error (e.g., TypeError or database crash)
  // The package's errorHandler will mask this as 500 "Internal Server Error"
  throw new Error('Database connection socket closed unexpectedly in pool worker #3');
}

// Scenario G: Auth Simulation
function postAuthLoginDemo(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return sendError(res, {
      message: 'Missing mandatory login credentials',
      statusCode: 400,
      code: 'MISSING_CREDENTIALS',
      details: {
        required: ['email', 'password'],
        received: { email: !!email, password: !!password }
      }
    });
  }

  if (email === 'demo@devflow.io' && password === 'devkit123') {
    return sendSuccess(res, {
      message: 'Authentication successful. Session token granted.',
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_token_391823901',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 42,
          name: 'Demo Architect',
          email: 'demo@devflow.io',
          role: 'Administrator'
        }
      },
      statusCode: 200
    });
  }

  return sendError(res, {
    message: 'Invalid email address or password provided',
    statusCode: 401,
    code: 'INVALID_CREDENTIALS',
    details: null
  });
}

module.exports = {
  getSuccessDemo,
  getErrorDemo,
  getPaginationDemo,
  getUsersPaginatedDemo,
  getExpressHelperDemo,
  getAsyncErrorDemo,
  postAuthLoginDemo
};
