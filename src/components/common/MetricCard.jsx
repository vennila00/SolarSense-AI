/* =========================================================
   SolarSense AI — Metric Card Component
   Inspired by Reference Image 3: Clear numerical focus, subtle borders, and contrast accents.
   ========================================================= */

import React from 'react';

export default function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'default', // 'default' | 'forest' | 'moss' | 'gold'
  badge,
  style = {},
}) {
  const isForest = variant === 'forest';
  const isMoss = variant === 'moss';
  const isGold = variant === 'gold';

  const cardStyle = {
    backgroundColor: isForest
      ? 'var(--color-forest-green)'
      : isMoss
      ? 'var(--color-soft-moss)'
      : isGold
      ? '#fdfaf2'
      : 'var(--color-pure-white)',
    border: isForest
      ? '1px solid var(--color-deep-evergreen)'
      : isGold
      ? '1px solid rgba(215, 166, 74, 0.3)'
      : '1px solid var(--color-soft-sand)',
    color: isForest ? '#ffffff' : 'var(--color-warm-charcoal)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.35rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '0.75rem',
    boxShadow: isForest
      ? '0 6px 18px rgba(35, 75, 56, 0.18)'
      : 'var(--shadow-subtle)',
    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
    ...style,
  };

  const labelColor = isForest
    ? 'rgba(255, 255, 255, 0.78)'
    : isMoss
    ? 'var(--color-forest-green)'
    : 'var(--color-muted-stone)';

  const valueColor = isForest
    ? '#ffffff'
    : 'var(--color-warm-charcoal)';

  const subtextColor = isForest
    ? 'var(--color-soft-moss)'
    : 'var(--color-muted-stone)';

  return (
    <div style={cardStyle}>
      {/* Top Row: Label and Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-headings)',
            fontSize: '0.8rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: labelColor,
          }}
        >
          {label}
        </span>
        {Icon && (
          <div
            style={{
              padding: '0.35rem',
              borderRadius: '6px',
              backgroundColor: isForest ? 'rgba(255, 255, 255, 0.12)' : 'var(--color-soft-moss)',
              color: isForest ? '#ffffff' : 'var(--color-forest-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={16} />
          </div>
        )}
      </div>

      {/* Center Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-headings)',
            fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
            fontWeight: '800',
            color: valueColor,
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
          }}
        >
          {value}
        </span>
        {badge && (
          <span
            className="badge"
            style={{
              backgroundColor: isForest ? 'rgba(255, 255, 255, 0.18)' : 'var(--color-soft-moss)',
              color: isForest ? '#ffffff' : 'var(--color-deep-evergreen)',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Subtext */}
      {subtext && (
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: '500',
            color: subtextColor,
          }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
}
