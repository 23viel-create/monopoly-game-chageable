import axios from 'axios';

// In development Vite proxies /api to the Express server (see vite.config.js).
// Set VITE_API_URL to point at a different backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

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
