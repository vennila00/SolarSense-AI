/* =========================================================
   SolarSense AI — Government Scheme Service
   Strictly adheres to server/controllers/schemeControllers.js contracts.
   ========================================================= */

import api from './api';

export const schemeService = {
  /**
   * Fetch government solar scheme for a given state.
   * Handles 404 cleanly by returning null rather than throwing.
   */
  async getSchemeByState(state) {
    if (!state) return null;
    try {
      const response = await api.get(`/api/schemes/${encodeURIComponent(state)}`);
      return response.data.scheme || null;
    } catch (err) {
      // If 404 or backend database is disconnected (500 Server Error),
      // return null so the UI cleanly displays the national PM Surya Ghar baseline
      console.warn(`Scheme lookup for ${state} returned:`, err.message);
      return null;
    }
  },
};
