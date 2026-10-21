/* =========================================================
   SolarSense AI — Local Estimation Cache Storage
   Treats local session estimates strictly separate from MongoDB server history.
   ========================================================= */

const STORAGE_KEY = 'solarsense_local_estimates';
const MAX_LOCAL_RECORDS = 10;

/**
 * Get all locally cached estimates
 */
export function getLocalEstimates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read local estimates:', err);
    return [];
  }
}

/**
 * Save an estimate to local browser cache.
 * Avoids duplicates with identical inputs and attaches local identifier.
 */
export function saveLocalEstimate(calculationData) {
  if (!calculationData) return;
  try {
    const current = getLocalEstimates();
    
    // Check if duplicate of most recent entry
    const isDuplicate = current.some(
      (item) =>
        item.location === calculationData.location &&
        Number(item.monthlyBill) === Number(calculationData.monthlyBill) &&
        Number(item.roofArea) === Number(calculationData.roofArea) &&
        Number(item.electricityTariff) === Number(calculationData.electricityTariff) &&
        Date.now() - new Date(item.createdAt || 0).getTime() < 1000 * 60 * 5 // within 5 min
    );

    if (isDuplicate) return current[0];

    const localRecord = {
      ...calculationData,
      localId: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      isLocal: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [localRecord, ...current].slice(0, MAX_LOCAL_RECORDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return localRecord;
  } catch (err) {
    console.error('Failed to save local estimate:', err);
  }
}

/**
 * Remove single locally cached record by localId
 */
export function removeLocalEstimate(localId) {
  try {
    const current = getLocalEstimates();
    const updated = current.filter((item) => item.localId !== localId && item._id !== localId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete local estimate:', err);
    return [];
  }
}

/**
 * Clear all local estimates
 */
export function clearLocalEstimates() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear local estimates:', err);
  }
}
