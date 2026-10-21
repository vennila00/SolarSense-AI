/* =========================================================
   SolarSense AI — Formatting Helpers
   ========================================================= */

/**
 * Format currency in Indian Rupees (INR) with the ₹ symbol and Indian numbering system.
 * Handles undefined, null, or non-finite inputs gracefully.
 */
export function formatRupees(amount) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹—';
  }
  const num = Math.round(Number(amount));
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Format capacity in kilowatts (kW)
 */
export function formatKW(val) {
  if (val === undefined || val === null || isNaN(Number(val))) {
    return '— kW';
  }
  return `${Number(val).toFixed(1)} kW`;
}

/**
 * Format area in square feet
 */
export function formatSqFt(val) {
  if (val === undefined || val === null || isNaN(Number(val))) {
    return '— sq. ft.';
  }
  return `${Number(val).toLocaleString('en-IN')} sq. ft.`;
}

/**
 * Format energy units in kWh
 */
export function formatUnits(val) {
  if (val === undefined || val === null || isNaN(Number(val))) {
    return '— kWh';
  }
  return `${Number(val).toLocaleString('en-IN')} kWh`;
}

/**
 * Format CO2 reduction in Metric Tons
 */
export function formatTons(val) {
  if (val === undefined || val === null) {
    return '— Tons/yr';
  }
  const parsed = parseFloat(val);
  if (isNaN(parsed)) return `${val} Tons/yr`;
  return `${parsed.toFixed(2)} Tons/yr`;
}

/**
 * Format date nicely in Indian locale
 */
export function formatDate(dateString) {
  if (!dateString) return 'Recent';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

/**
 * Safe numeric helper
 */
export function safeNumber(val, fallback = 0) {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}
