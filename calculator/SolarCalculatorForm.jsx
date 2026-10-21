/* =========================================================
   SolarSense AI — Solar Calculator Form
   Validates inputs, connects to POST /api/solar/calculate.
   ========================================================= */

import React, { useState } from 'react';
import FormField from '../common/FormField';
import { INDIAN_STATES } from '../../utils/constants';
import { Zap, MapPin, IndianRupee, Maximize2, ShieldAlert } from 'lucide-react';

export default function SolarCalculatorForm({
  initialValues,
  onSubmit,
  loading,
  error,
}) {
  const [formData, setFormData] = useState({
    location: initialValues?.location || 'Maharashtra',
    monthlyBill: initialValues?.monthlyBill ?? 3000,
    roofArea: initialValues?.roofArea ?? 500,
    electricityTariff: initialValues?.electricityTariff ?? 8,
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.location || !formData.location.trim()) {
      errors.location = 'Please select your state or territory';
    }

    const bill = Number(formData.monthlyBill);
    if (!bill || bill <= 0) {
      errors.monthlyBill = 'Monthly electricity bill must be greater than ₹0';
    } else if (bill < 200) {
      errors.monthlyBill = 'Minimum residential bill recommended is ₹200';
    }

    const area = Number(formData.roofArea);
    if (!area || area <= 0) {
      errors.roofArea = 'Available roof area must be greater than 0 sq. ft.';
    } else if (area < 50) {
      errors.roofArea = 'A minimum of 50 sq. ft. is required for solar panels';
    }

    const tariff = Number(formData.electricityTariff);
    if (!tariff || tariff <= 0) {
      errors.electricityTariff = 'Tariff must be greater than ₹0 per unit';
    } else if (tariff > 30) {
      errors.electricityTariff = 'Tariff typically ranges between ₹3 to ₹15 / unit';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      location: formData.location.trim(),
      monthlyBill: Number(formData.monthlyBill),
      roofArea: Number(formData.roofArea),
      electricityTariff: Number(formData.electricityTariff),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer} noValidate>
      {/* State / Location Selector */}
      <FormField
        id="location"
        label="State / Union Territory"
        hint="Determines DISCOM & solar irradiation factor"
        error={fieldErrors.location}
        required
      >
        <select
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className={`form-select ${fieldErrors.location ? 'is-error' : ''}`}
        >
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </FormField>

      {/* Monthly Bill Input */}
      <FormField
        id="monthlyBill"
        label="Average Monthly Electricity Bill"
        hint="From your recent summer / winter bill"
        error={fieldErrors.monthlyBill}
        prefix="₹"
        required
      >
        <input
          id="monthlyBill"
          type="number"
          min="100"
          max="500000"
          step="50"
          value={formData.monthlyBill}
          onChange={(e) => handleChange('monthlyBill', e.target.value)}
          placeholder="e.g. 3500"
          className={`form-input has-prefix ${fieldErrors.monthlyBill ? 'is-error' : ''}`}
        />
      </FormField>

      {/* Two Columns: Roof Area and Tariff */}
      <div style={styles.twoCols}>
        <FormField
          id="roofArea"
          label="Available Roof Area"
          hint="Shadow-free space"
          error={fieldErrors.roofArea}
          suffix="sq. ft."
          required
        >
          <input
            id="roofArea"
            type="number"
            min="50"
            max="100000"
            step="10"
            value={formData.roofArea}
            onChange={(e) => handleChange('roofArea', e.target.value)}
            placeholder="e.g. 500"
            className={`form-input has-suffix ${fieldErrors.roofArea ? 'is-error' : ''}`}
          />
        </FormField>

        <FormField
          id="electricityTariff"
          label="Electricity Tariff"
          hint="Average rate per kWh"
          error={fieldErrors.electricityTariff}
          prefix="₹"
          suffix="/ unit"
          required
        >
          <input
            id="electricityTariff"
            type="number"
            min="1"
            max="30"
            step="0.1"
            value={formData.electricityTariff}
            onChange={(e) => handleChange('electricityTariff', e.target.value)}
            placeholder="e.g. 8"
            className={`form-input has-prefix has-suffix ${
              fieldErrors.electricityTariff ? 'is-error' : ''
            }`}
          />
        </FormField>
      </div>

      {/* Server Error Notice */}
      {error && (
        <div style={styles.errorNotice} className="animate-fade-in" role="alert">
          <ShieldAlert size={18} color="var(--color-danger)" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={styles.submitBtn}
      >
        <Zap size={18} />
        <span>{loading ? 'Evaluating Sizing & Subsidies...' : 'Calculate My Solar Estimate'}</span>
      </button>

      <p style={styles.privacyNote}>
        Zero spam or phone inquiries. Calculations are powered strictly by your inputs and
        official MNRE benchmarks.
      </p>
    </form>
  );
}

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  twoCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  submitBtn: {
    width: '100%',
    padding: '0.95rem 1.5rem',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  errorNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    backgroundColor: 'var(--color-danger-bg)',
    color: 'var(--color-danger)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.88rem',
    marginBottom: '0.75rem',
  },
  privacyNote: {
    fontSize: '0.78rem',
    color: 'var(--color-muted-stone)',
    textAlign: 'center',
    marginTop: '0.75rem',
    lineHeight: '1.4',
  },
};
