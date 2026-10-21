/* =========================================================
   SolarSense AI — Authentication Service
   Strictly adheres to server/controllers/authControllers.js contracts.
   ========================================================= */

import api from './api';

export const authService = {
  /**
   * Register a new user
   * Payload: { fullName, email, password, phone, location }
   */
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   * Payload: { email, password }
   */
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    const { token, user } = response.data;

    if (token) {
      localStorage.setItem('solarsense_token', token);
    }
    if (user) {
      localStorage.setItem('solarsense_user', JSON.stringify(user));
    }

    return response.data;
  },

  /**
   * Fetch authenticated user's profile
   */
  async getProfile() {
    const response = await api.get('/api/auth/profile');
    return response.data.user;
  },

  /**
   * Logout user and remove stored credentials
   */
  logout() {
    localStorage.removeItem('solarsense_token');
    localStorage.removeItem('solarsense_user');
  },

  /**
   * Get cached user from localStorage
   */
  getCachedUser() {
    try {
      const raw = localStorage.getItem('solarsense_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get stored JWT token
   */
  getToken() {
    return localStorage.getItem('solarsense_token');
  },
};
