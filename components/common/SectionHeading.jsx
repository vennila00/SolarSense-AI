/* =========================================================
   SolarSense AI — Section Heading Component
   Provides consistent eyebrow tag, title, and descriptive copy.
   ========================================================= */

import React from 'react';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  theme = 'light',
  style = {},
}) {
  const isCenter = align === 'center';
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCenter ? 'center' : 'flex-start',
        textAlign: isCenter ? 'center' : 'left',
        maxWidth: isCenter ? '720px' : '640px',
        margin: isCenter ? '0 auto 2.5rem auto' : '0 0 2rem 0',
        ...style,
      }}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        style={{
          color: isDark ? '#ffffff' : 'var(--color-warm-charcoal)',
          marginBottom: '0.75rem',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'var(--color-charcoal-subtle)',
            fontSize: '1.05rem',
            lineHeight: '1.6',
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
