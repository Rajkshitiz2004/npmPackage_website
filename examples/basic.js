'use strict';
const { success, error, paginate, paginatedResponse } = require("api-response-kit-kshitiz");
console.log('Success:', success({ message: 'User fetched', data: { id: 1, name: 'Rahul' } }));
console.log('Error:', error({ message: 'User not found', statusCode: 404, code: 'USER_NOT_FOUND' }));
console.log('Pagination:', paginate({ page: 2, limit: 10, total: 45 }));
console.log('Paginated:', paginatedResponse({ data: [{ id: 11 }], page: 2, limit: 10, total: 45 }));
