import axios from 'axios';
import { clearSession, getToken } from '../auth';

// In development Vite proxies /api to the Express server (see vite.config.js).
// Set VITE_API_URL to point at a different backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Endpoints that never need a token. Not sending one also means a wrong
// password on the login form can't be mistaken for an expired session below.
const PUBLIC_ENDPOINTS = ['/api/users/login', '/api/users/register'];

// Attach the JWT to every other request when the user is logged in
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !PUBLIC_ENDPOINTS.includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 on a request that carried a token means the session is no longer
// valid (expired, or the user was deleted), so send the user back to login.
// A 401 without a token (e.g. wrong password on the login form) is left to the page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      clearSession();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

// Turns an axios error into a message that can be shown to the user
export function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.request && !error.response) {
    return 'Cannot reach the server. Please try again later.';
  }
  return 'Something went wrong. Please try again.';
}

export default api;
