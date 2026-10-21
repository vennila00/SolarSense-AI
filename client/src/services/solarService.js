/* =========================================================
   SolarSense AI — Solar Calculator & History Service
   Strictly adheres to server/controllers/solarControllers.js contracts.
   ========================================================= */

import api from './api';

export const solarService = {
  /**
   * Run solar calculation
   * Payload: { location, monthlyBill, roofArea, electricityTariff }
   */
  async calculate(payload) {
    const response = await api.post('/api/solar/calculate', {
      location: payload.location,
      monthlyBill: Number(payload.monthlyBill),
      roofArea: Number(payload.roofArea),
      electricityTariff: Number(payload.electricityTariff),
    });
    return response.data.calculation;
  },

  /**
   * Fetch authenticated user's calculation history from MongoDB
   */
  async getHistory() {
    const response = await api.get('/api/solar/history');
    return response.data.calculations || [];
  },

  /**
   * Delete calculation record from MongoDB
   */
  async deleteCalculation(id) {
    const response = await api.delete(`/api/solar/${id}`);
    return response.data;
  },
};
