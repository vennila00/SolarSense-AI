/* =========================================================
   SolarSense AI — SchemeCard Component
   Displays verified state & central solar subsidies.
   ========================================================= */

import React from 'react';
import { formatRupees, formatKW } from '../../utils/formatters';
import { ShieldCheck, FileText, CheckCircle2, Award, ExternalLink } from 'lucide-react';

export default function SchemeCard({ scheme, stateName }) {
  if (!scheme) {
    return (
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badgeRow}>
            <Award size={18} color="var(--color-forest-green)" />
            <span className="badge badge-moss">National Central Scheme</span>
          </div>
          <h3 style={styles.title}>PM Surya Ghar: Muft Bijli Yojana</h3>
        </div>

        <p style={styles.description}>
          While no state-specific top-up scheme was found in our database for{' '}
          <strong>{stateName || 'your state'}</strong>, residential consumers across India are
          eligible for the Central Financial Assistance (CFA) subsidy up to ₹78,000 directly
          credited to the beneficiary bank account.
        </p>

        <div style={styles.metricsRow}>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Max Central Subsidy</span>
            <span style={styles.metricValue}>₹78,000</span>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Eligible Capacity</span>
            <span style={styles.metricValue}>Up to 3 kW</span>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Target Beneficiaries</span>
            <span style={styles.metricValue}>Individual Homes</span>
          </div>
        </div>

        <div style={styles.docsArea}>
          <h4 style={styles.docsHeading}>Standard National Portal Documents:</h4>
          <ul style={styles.docsList}>
            <li style={styles.docItem}>
              <CheckCircle2 size={14} color="var(--color-sage-green)" />
              <span>Electricity Bill (last 3 months with consumer number)</span>
            </li>
            <li style={styles.docItem}>
              <CheckCircle2 size={14} color="var(--color-sage-green)" />
              <span>Aadhaar Card of electricity meter owner</span>
            </li>
            <li style={styles.docItem}>
              <CheckCircle2 size={14} color="var(--color-sage-green)" />
              <span>Bank Passbook / Cancelled Cheque (for subsidy direct transfer)</span>
            </li>
            <li style={styles.docItem}>
              <CheckCircle2 size={14} color="var(--color-sage-green)" />
              <span>Rooftop Ownership or Municipal Property Tax receipt</span>
            </li>
          </ul>
        </div>

        <div style={styles.actionRow}>
          <a
            href="https://pmsuryaghar.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <span>Visit PM Surya Ghar National Portal</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    );
  }

  const { schemeName, subsidyAmount, maxCapacity, description, documents, state } = scheme;

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.badgeRow}>
          <Award size={18} color="var(--color-forest-green)" />
          <span className="badge badge-forest">{state || stateName} Recognized Policy</span>
        </div>
        <h3 style={styles.title}>{schemeName}</h3>
      </div>

      {description && <p style={styles.description}>{description}</p>}

      <div style={styles.metricsRow}>
        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>Available Subsidy Cap</span>
          <span style={{ ...styles.metricValue, color: 'var(--color-forest-green)' }}>
            {formatRupees(subsidyAmount)}
          </span>
        </div>
        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>Maximum Subsidized Capacity</span>
          <span style={styles.metricValue}>{formatKW(maxCapacity)}</span>
        </div>
        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>Jurisdiction</span>
          <span style={styles.metricValue}>{state || 'State DISCOM'}</span>
        </div>
      </div>

      {Array.isArray(documents) && documents.length > 0 && (
        <div style={styles.docsArea}>
          <h4 style={styles.docsHeading}>Mandatory Application Documents:</h4>
          <ul style={styles.docsList}>
            {documents.map((doc, idx) => (
              <li key={idx} style={styles.docItem}>
                <CheckCircle2 size={14} color="var(--color-sage-green)" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={styles.actionRow}>
        <a
          href="https://pmsuryaghar.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
        >
          <span>Apply on Official Portal</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--color-pure-white)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--color-deep-evergreen)',
    margin: 0,
  },
  description: {
    fontSize: '0.92rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.6',
    margin: 0,
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '0.85rem',
    backgroundColor: 'var(--color-warm-ivory)',
    border: '1px solid var(--color-soft-sand)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  metricLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'var(--color-muted-stone)',
    letterSpacing: '0.04em',
  },
  metricValue: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--color-warm-charcoal)',
  },
  docsArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  docsHeading: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: 'var(--color-forest-green)',
    margin: 0,
  },
  docsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    padding: 0,
    margin: 0,
  },
  docItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.88rem',
    color: 'var(--color-charcoal-subtle)',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '0.5rem',
    borderTop: '1px solid var(--color-soft-sand)',
  },
};
