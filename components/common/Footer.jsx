/* =========================================================
   SolarSense AI — Footer
   Deep evergreen theme with essential references & official disclaimers.
   ========================================================= */

import React from 'react';
import { Sun, Leaf, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { DISCLAIMER_TEXT } from '../../utils/constants';

export default function Footer({ navigateTo }) {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.content}>
        {/* Top Grid */}
        <div style={styles.topGrid}>
          {/* Brand Col */}
          <div style={styles.brandCol}>
            <div style={styles.brandRow}>
              <div style={styles.brandIconContainer}>
                <Sun size={16} color="#D7A64A" />
                <Leaf size={13} color="#879B7B" style={styles.leafIcon} />
              </div>
              <span style={styles.brandName}>SolarSense AI</span>
            </div>

            <p style={styles.brandTagline}>
              Empowering Indian homeowners with accurate solar sizing, honest financial
              projections, and national subsidy navigation.
            </p>

            <div style={styles.trustBadge}>
              <ShieldCheck size={16} color="#879B7B" />
              <span>Aligned with MNRE & PM Surya Ghar Guidelines</span>
            </div>
          </div>

          {/* Platform Links */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Platform</h4>
            <ul style={styles.linkList}>
              <li>
                <button onClick={() => navigateTo('home')} style={styles.footerLink}>
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('calculator')} style={styles.footerLink}>
                  Rooftop Calculator
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('schemes')} style={styles.footerLink}>
                  Government Schemes
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('sustainability')} style={styles.footerLink}>
                  Environmental Impact
                </button>
              </li>
            </ul>
          </div>

          {/* Official Resources */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Official Portals</h4>
            <ul style={styles.linkList}>
              <li>
                <a
                  href="https://pmsuryaghar.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.externalLink}
                >
                  <span>PM Surya Ghar Portal</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://mnre.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.externalLink}
                >
                  <span>MNRE India</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://solarrooftop.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.externalLink}
                >
                  <span>National Solar Rooftop Portal</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Strip */}
        <div style={styles.disclaimerBox}>
          <p style={styles.disclaimerText}>
            <strong>Regulatory Notice:</strong> {DISCLAIMER_TEXT}
          </p>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} SolarSense AI. Crafted for sustainable living.
          </p>
          <div style={styles.builtWith}>
            <span>Clean Energy for Indian Homes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: 'var(--color-deep-evergreen)',
    color: '#ffffff',
    paddingTop: '4rem',
    paddingBottom: '2.5rem',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '3rem',
    alignItems: 'start',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  brandIconContainer: {
    position: 'relative',
    width: '30px',
    height: '30px',
    borderRadius: '7px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafIcon: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
  },
  brandName: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  brandTagline: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.72)',
    lineHeight: '1.5',
  },
  trustBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: 'var(--color-soft-moss)',
    backgroundColor: 'rgba(135, 155, 123, 0.12)',
    padding: '0.4rem 0.75rem',
    borderRadius: 'var(--radius-pill)',
    width: 'fit-content',
  },
  linkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  colTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.92rem',
    fontWeight: '700',
    color: 'var(--color-soft-moss)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  footerLink: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',
    transition: 'color var(--transition-fast)',
  },
  externalLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    transition: 'color var(--transition-fast)',
  },
  disclaimerBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem 1.25rem',
  },
  disclaimerText: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: '1.6',
    margin: 0,
  },
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  copyright: {
    fontSize: '0.82rem',
    color: 'rgba(255, 255, 255, 0.55)',
    margin: 0,
  },
  builtWith: {
    fontSize: '0.82rem',
    color: 'var(--color-sage-green)',
  },
};
