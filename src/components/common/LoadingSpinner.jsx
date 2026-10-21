/* =========================================================
   SolarSense AI — LoadingSpinner Component
   Subtle, elegant circular animated spinner in forest green.
   ========================================================= */

import React from 'react';

export default function LoadingSpinner({ size = 28, text, color = 'var(--color-forest-green)' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '1.5rem',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="var(--color-soft-moss)"
          strokeWidth="2.5"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {text && (
        <span
          style={{
            fontFamily: 'var(--font-headings)',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--color-charcoal-subtle)',
          }}
        >
          {text}
        </span>
      )}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
