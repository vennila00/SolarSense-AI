/* =========================================================
   SolarSense AI — Reusable API Service Client
   ========================================================= */

import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('solarsense_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Graceful error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if 401 unauthorized (expired or invalid token)
    if (error.response && error.response.status === 401) {
      // Clear token if server explicitly rejected it
      if (localStorage.getItem('solarsense_token')) {
        localStorage.removeItem('solarsense_token');
        localStorage.removeItem('solarsense_user');
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to SolarSense service';

    return Promise.reject(new Error(message));
  }
);

export default api;
