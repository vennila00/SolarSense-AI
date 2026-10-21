/* =========================================================
   SolarSense AI — Dedicated Solar Calculator Page
   Two-column desktop layout, live calculation integration & results dashboard.
   ========================================================= */

import React, { useState } from 'react';
import SolarCalculatorForm from '../components/calculator/SolarCalculatorForm';
import SolarResultsDashboard from '../components/calculator/SolarResultsDashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { solarService } from '../services/solarService';
import { saveLocalEstimate } from '../utils/localEstimateStorage';
import { DEFAULT_CALCULATOR_INPUTS, SOLAR_IMAGES, FALLBACK_SOLAR_SVG } from '../utils/constants';
import { Sun, CheckCircle2, ShieldCheck, Zap, Info } from 'lucide-react';

export default function CalculatorPage({ initialCalculation, onCalculationComplete }) {
  const [result, setResult] = useState(initialCalculation || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const calculation = await solarService.calculate(payload);
      setResult(calculation);

      // Save to local estimate cache (distinct from MongoDB history)
      saveLocalEstimate(calculation);

      if (onCalculationComplete) {
        onCalculationComplete(calculation);
      }

      // Smooth scroll to results on smaller devices
      setTimeout(() => {
        const resultsEl = document.getElementById('results-view');
        if (resultsEl && window.innerWidth < 1024) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err.message || 'Failed to generate solar estimate. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Page Header */}
      <div className="container" style={styles.headerArea}>
        <span className="eyebrow">
          <Sun size={14} color="#D7A64A" />
          <span>Interactive Sizing & Subsidy Planner</span>
        </span>
        <h1 style={styles.pageTitle}>Find the right solar system for your home.</h1>
        <p style={styles.pageSubtitle}>
          Share a few details about your electricity usage and rooftop space to explore a
          personalized estimate based on PM Surya Ghar guidelines.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="container" style={styles.mainGrid}>
        {/* Left Column: Form Card */}
        <div style={styles.leftColumn}>
          <div className="card" style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Property & Usage Inputs</h2>
              <p style={styles.cardSubtitle}>
                Adjust numbers to see real-time updates to your system size and subsidy cap.
              </p>
            </div>

            <SolarCalculatorForm
              initialValues={result || DEFAULT_CALCULATOR_INPUTS}
              onSubmit={handleCalculate}
              loading={loading}
              error={error}
            />
          </div>

          {/* Contextual Guidance Panel Below Form */}
          <div style={styles.guidanceBox}>
            <div style={styles.guidanceHeader}>
              <Info size={16} color="var(--color-forest-green)" />
              <strong style={styles.guidanceTitle}>How we calculate sizing</strong>
            </div>
            <p style={styles.guidanceText}>
              In India, 1 kW of grid-tied rooftop solar generates approximately 120 units (kWh) of
              clean electricity each month, varying slightly by regional solar irradiation. We calculate
              whole 550W panels to match approximately 90% of your average consumption.
            </p>
          </div>
        </div>

        {/* Right Column: Results Dashboard or Informational Empty State */}
        <div style={styles.rightColumn} id="results-view">
          {loading && (
            <div className="card" style={styles.loadingCard}>
              <LoadingSpinner
                size={36}
                text="Modeling solar irradiation & calculating subsidies..."
              />
            </div>
          )}

          {!loading && result && (
            <SolarResultsDashboard result={result} isLocallyCached={result.isLocal} />
          )}

          {!loading && !result && (
            <div className="card" style={styles.emptyCard}>
              <div style={styles.emptyGraphicArea}>
                <div style={styles.imageBackingSmall} />
                <div style={styles.previewImageWrap} className="editorial-image-frame">
                  <img
                    src={SOLAR_IMAGES.solarCellsDetail}
                    alt="Rooftop solar cell detail in sunlight"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_SOLAR_SVG;
                    }}
                    style={styles.previewImg}
                  />
                </div>
              </div>

              <div style={styles.emptyContent}>
                <h3 style={styles.emptyTitle}>Your solar plan will appear here</h3>
                <p style={styles.emptyText}>
                  Complete the property details on the left and click{' '}
                  <strong>“Calculate My Solar Estimate”</strong> to see system sizing in kW,
                  panel counts, net expenses, subsidy eligibility, and a 5-year savings projection.
                </p>

                <div style={styles.keyHighlightsList}>
                  <div style={styles.highlightItem}>
                    <CheckCircle2 size={15} color="var(--color-sage-green)" />
                    <span>Includes PM Surya Ghar subsidy deductions up to ₹78,000</span>
                  </div>
                  <div style={styles.highlightItem}>
                    <CheckCircle2 size={15} color="var(--color-sage-green)" />
                    <span>Calculates shadow-free rooftop square footage footprint</span>
                  </div>
                  <div style={styles.highlightItem}>
                    <CheckCircle2 size={15} color="var(--color-sage-green)" />
                    <span>Downloadable PDF feasibility report</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    paddingTop: '2.5rem',
    paddingBottom: '5rem',
  },
  headerArea: {
    marginBottom: '2.5rem',
  },
  pageTitle: {
    color: 'var(--color-deep-evergreen)',
    marginBottom: '0.65rem',
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--color-charcoal-subtle)',
    maxWidth: '680px',
    margin: 0,
    lineHeight: '1.6',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(340px, 440px) 1fr',
    gap: '2.5rem',
    alignItems: 'start',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formCard: {
    padding: '2rem',
  },
  cardHeader: {
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    color: 'var(--color-warm-charcoal)',
    margin: 0,
    marginBottom: '0.35rem',
  },
  cardSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--color-muted-stone)',
    margin: 0,
  },
  guidanceBox: {
    backgroundColor: 'var(--color-pure-white)',
    border: '1px solid var(--color-soft-sand)',
    borderRadius: 'var(--radius-md)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  guidanceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
  },
  guidanceTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.86rem',
    color: 'var(--color-forest-green)',
  },
  guidanceText: {
    fontSize: '0.82rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.5',
    margin: 0,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  loadingCard: {
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  emptyCard: {
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.75rem',
  },
  emptyGraphicArea: {
    position: 'relative',
    width: '100%',
    maxWidth: '380px',
  },
  imageBackingSmall: {
    position: 'absolute',
    top: '10px',
    right: '-10px',
    bottom: '-10px',
    left: '10px',
    backgroundColor: 'var(--color-soft-sand)',
    borderRadius: 'var(--radius-lg)',
  },
  previewImageWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 10',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  emptyContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    maxWidth: '520px',
  },
  emptyTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.35rem',
    color: 'var(--color-deep-evergreen)',
    margin: 0,
  },
  emptyText: {
    fontSize: '0.92rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.6',
    margin: 0,
  },
  keyHighlightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    textAlign: 'left',
    marginTop: '0.75rem',
    padding: '1rem 1.25rem',
    backgroundColor: 'var(--color-warm-ivory)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-soft-sand)',
    width: '100%',
  },
  highlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.84rem',
    color: 'var(--color-warm-charcoal)',
  },
};

// Responsive style tag for 1024px breakdown
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 1024px) {
      .container[style*="minmax(340px, 440px)"] {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}
