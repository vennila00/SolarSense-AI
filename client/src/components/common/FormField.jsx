/* =========================================================
   SolarSense AI — FormField Component
   Accessible form wrapper with inline validation & affixes.
   ========================================================= */

import React from 'react';

export default function FormField({
  id,
  label,
  error,
  hint,
  required,
  prefix,
  suffix,
  children,
  style = {},
}) {
  return (
    <div className="form-group" style={style}>
      {label && (
        <label htmlFor={id} className="form-label">
          <span>
            {label}
            {required && (
              <span style={{ color: 'var(--color-forest-green)', marginLeft: '3px' }}>*</span>
            )}
          </span>
          {hint && <span className="form-hint">{hint}</span>}
        </label>
      )}

      <div className="input-with-affix">
        {prefix && <span className="input-affix input-affix-prefix">{prefix}</span>}
        {children}
        {suffix && <span className="input-affix input-affix-suffix">{suffix}</span>}
      </div>

      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
