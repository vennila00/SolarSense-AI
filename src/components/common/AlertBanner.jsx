/* =========================================================
   SolarSense AI — AlertBanner Component
   Accessible notification message with status icons.
   ========================================================= */

import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function AlertBanner({ type = 'info', message, children, style = {} }) {
  if (!message && !children) return null;

  const iconMap = {
    info: <Info size={18} />,
    success: <CheckCircle2 size={18} />,
    warning: <AlertTriangle size={18} />,
    danger: <AlertCircle size={18} />,
    error: <AlertCircle size={18} />,
  };

  const alertClass = type === 'error' ? 'alert-danger' : `alert-${type}`;
  const icon = iconMap[type] || iconMap.info;

  return (
    <div className={`alert ${alertClass} animate-fade-in`} style={style} role="alert">
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
      <div style={{ flex: 1 }}>{message || children}</div>
    </div>
  );
}
