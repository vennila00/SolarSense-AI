/* =========================================================
   SolarSense AI — EmptyState Component
   Thoughtful empty states avoiding generic placeholders.
   ========================================================= */

import React from 'react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  style = {},
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        backgroundColor: 'var(--color-pure-white)',
        border: '1px dashed var(--color-soft-sand-dark)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '560px',
        margin: '0 auto',
        ...style,
      }}
    >
      {Icon && (
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-soft-moss)',
            color: 'var(--color-forest-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <Icon size={26} />
        </div>
      )}

      {title && (
        <h3
          style={{
            fontFamily: 'var(--font-headings)',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: 'var(--color-warm-charcoal)',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </h3>
      )}

      {description && (
        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--color-muted-stone)',
            lineHeight: '1.5',
            maxWidth: '420px',
            marginBottom: actionText ? '1.5rem' : 0,
          }}
        >
          {description}
        </p>
      )}

      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
}
