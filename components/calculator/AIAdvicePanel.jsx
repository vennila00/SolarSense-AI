/* =========================================================
   SolarSense AI — AI Solar Advisor Panel
   Refined advisory section presenting scheme guidance & checklist.
   ========================================================= */

import React from 'react';
import { Sparkles, FileText, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

export default function AIAdvicePanel({ aiAdvice, location }) {
  if (!aiAdvice) return null;

  const { schemeName, summary, stateTips, documents } = aiAdvice;

  return (
    <div style={styles.panel} className="animate-fade-in">
      {/* Header Strip */}
      <div style={styles.header}>
        <div style={styles.badgeRow}>
          <div style={styles.iconEmblem}>
            <Sparkles size={16} color="var(--color-forest-green)" />
          </div>
          <div>
            <span style={styles.eyebrow}>Solar Guidance & Advisory</span>
            <h4 style={styles.schemeTitle}>{schemeName || 'PM Surya Ghar: Muft Bijli Yojana'}</h4>
          </div>
        </div>
        <span className="badge badge-moss">Automated Insights</span>
      </div>

      {/* Summary Narrative */}
      {summary && (
        <p style={styles.summaryText}>
          {summary}
        </p>
      )}

      {/* Two Column Section: DISCOM Guidance & Required Documents */}
      <div style={styles.detailsGrid}>
        {/* State / DISCOM Guidance */}
        {stateTips && (
          <div style={styles.cardItem}>
            <div style={styles.cardItemHeader}>
              <Building2 size={16} color="var(--color-forest-green)" />
              <strong style={styles.cardItemTitle}>
                {location ? `${location} DISCOM & Grid Guidance` : 'DISCOM & Grid Guidance'}
              </strong>
            </div>
            <p style={styles.cardItemText}>{stateTips}</p>
          </div>
        )}

        {/* Required Documents Checklist */}
        {Array.isArray(documents) && documents.length > 0 && (
          <div style={styles.cardItem}>
            <div style={styles.cardItemHeader}>
              <FileText size={16} color="var(--color-forest-green)" />
              <strong style={styles.cardItemTitle}>Application Documentation Checklist</strong>
            </div>
            <ul style={styles.documentList}>
              {documents.map((doc, idx) => (
                <li key={idx} style={styles.documentItem}>
                  <CheckCircle2 size={14} color="var(--color-sage-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Advisory Disclaimer */}
      <div style={styles.disclaimerNote}>
        <AlertCircle size={13} color="var(--color-muted-stone)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={styles.disclaimerText}>
          Advisory suggestions are generated based on regulatory guidelines and do not constitute
          an official binding DISCOM approval or guaranteed government grant.
        </span>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    backgroundColor: '#FAF9F5', // soft warm ivory surface
    border: '1px solid var(--color-soft-sand)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  iconEmblem: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'var(--color-soft-moss)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-sage-green)',
  },
  schemeTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--color-deep-evergreen)',
    margin: 0,
  },
  summaryText: {
    fontSize: '0.95rem',
    color: 'var(--color-warm-charcoal)',
    lineHeight: '1.6',
    margin: 0,
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem',
  },
  cardItem: {
    backgroundColor: 'var(--color-pure-white)',
    border: '1px solid var(--color-soft-sand)',
    borderRadius: 'var(--radius-md)',
    padding: '1.15rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  cardItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  cardItemTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.88rem',
    color: 'var(--color-forest-green)',
  },
  cardItemText: {
    fontSize: '0.86rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.5',
    margin: 0,
  },
  documentList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    margin: 0,
    padding: 0,
  },
  documentItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-subtle)',
  },
  disclaimerNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    borderTop: '1px solid var(--color-soft-sand)',
    paddingTop: '0.75rem',
  },
  disclaimerText: {
    fontSize: '0.75rem',
    color: 'var(--color-muted-stone)',
    lineHeight: '1.45',
  },
};
