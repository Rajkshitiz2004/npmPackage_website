import axios from 'axios';

// In production on Vercel or when deployed as services under the same domain,
// API requests route through the public rewrite (/api/...) on the same origin (empty baseURL).
// For standalone local development, falls back to VITE_API_BASE_URL or http://localhost:5001.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined
  ? import.meta.env.VITE_API_BASE_URL
  : (import.meta.env.PROD ? '' : 'http://localhost:5001');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for measured execution time
export async function executeMeasuredRequest(requestFn) {
  const startTime = performance.now();
  try {
    const response = await requestFn();
    const duration = Math.round(performance.now() - startTime);
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
      duration,
      isError: false,
    };
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    if (error.response) {
      // Backend returned an HTTP error response (e.g., 400, 401, 403, 404, 422, 500)
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        duration,
        isError: true,
        errorType: 'RESPONSE_ERROR',
      };
    } else if (error.request) {
      // Network connectivity failure (e.g. backend server is offline or unreachable)
      return {
        status: 0,
        statusText: 'Network / Connection Error',
        data: {
          success: false,
          message: `Unable to connect to the Express backend at ${API_BASE_URL}. Please ensure the backend server is running with 'npm run dev'.`,
          code: 'NETWORK_ERROR',
          details: { error: error.message }
        },
        headers: {},
        duration,
        isError: true,
        errorType: 'NETWORK_ERROR',
      };
    } else {
      return {
        status: 0,
        statusText: 'Client Request Setup Error',
        data: {
          success: false,
          message: error.message,
          code: 'CLIENT_ERROR'
        },
        headers: {},
        duration,
        isError: true,
        errorType: 'SETUP_ERROR',
      };
    }
  }
}
