/* =========================================================
   SolarSense AI — Government Schemes Explorer Page
   State-wise scheme lookup connecting to GET /api/schemes/:state.
   ========================================================= */

import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/common/SectionHeading';
import SchemeCard from '../components/schemes/SchemeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertBanner from '../components/common/AlertBanner';
import { schemeService } from '../services/schemeService';
import { INDIAN_STATES } from '../utils/constants';
import { ShieldCheck, MapPin, Search, ExternalLink, HelpCircle } from 'lucide-react';

export default function SchemesPage({ initialLocation = 'Maharashtra' }) {
  const [selectedState, setSelectedState] = useState(initialLocation);
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchScheme() {
      if (!selectedState) return;
      setLoading(true);
      setError(null);

      try {
        const data = await schemeService.getSchemeByState(selectedState);
        setScheme(data);
      } catch (err) {
        console.error('Error fetching scheme:', err);
        setError('Unable to load scheme details for the selected state at this time.');
      } finally {
        setLoading(false);
      }
    }

    fetchScheme();
  }, [selectedState]);

  return (
    <div style={styles.pageContainer}>
      {/* Page Header */}
      <div className="container" style={styles.headerArea}>
        <SectionHeading
          eyebrow="Government Subsidies & Policies"
          title="Explore Rooftop Solar Schemes by State"
          subtitle="Discover central CFA subsidies under PM Surya Ghar Muft Bijli Yojana and state-specific DISCOM incentives applicable to your residence."
        />

        {/* State Selector Bar */}
        <div style={styles.selectorBar} className="card">
          <div style={styles.selectorLabelWrap}>
            <MapPin size={18} color="var(--color-forest-green)" />
            <label htmlFor="state-selector" style={styles.selectorLabel}>
              Select your State or Territory:
            </label>
          </div>

          <div style={styles.selectWrapper}>
            <select
              id="state-selector"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="form-select"
              style={styles.stateSelect}
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scheme Details Container */}
      <div className="container" style={styles.contentArea}>
        {loading && (
          <div className="card" style={styles.loadingCard}>
            <LoadingSpinner size={32} text={`Looking up solar policies for ${selectedState}...`} />
          </div>
        )}

        {error && (
          <AlertBanner type="danger" message={error} style={{ marginBottom: '1.5rem' }} />
        )}

        {!loading && (
          <div style={styles.resultLayout}>
            {/* Main Scheme Card */}
            <SchemeCard scheme={scheme} stateName={selectedState} />

            {/* Regulatory Advice Sidebar */}
            <div style={styles.sidebarColumn}>
              {/* Subsidy Structure Card */}
              <div className="card" style={styles.sidebarCard}>
                <h4 style={styles.sidebarTitle}>National Residential CFA Slabs</h4>
                <p style={styles.sidebarText}>
                  Under the central PM Surya Ghar scheme, Direct Benefit Transfer (DBT) is provided at:
                </p>

                <div style={styles.slabList}>
                  <div style={styles.slabItem}>
                    <strong style={styles.slabCapacity}>First 2 kW:</strong>
                    <span style={styles.slabRate}>₹30,000 per kW</span>
                  </div>
                  <div style={styles.slabItem}>
                    <strong style={styles.slabCapacity}>Next 1 kW (up to 3 kW):</strong>
                    <span style={styles.slabRate}>₹18,000 per kW</span>
                  </div>
                  <div style={styles.slabItem}>
                    <strong style={styles.slabCapacity}>Above 3 kW:</strong>
                    <span style={styles.slabRate}>Cap at ₹78,000 total</span>
                  </div>
                </div>
              </div>

              {/* DISCOM Application Steps Card */}
              <div className="card" style={styles.sidebarCard}>
                <h4 style={styles.sidebarTitle}>Official Net-Metering Process</h4>
                <ol style={styles.processSteps}>
                  <li style={styles.stepItem}>
                    Register on the National Portal with your DISCOM consumer number.
                  </li>
                  <li style={styles.stepItem}>
                    Select an empaneled vendor registered with your local DISCOM.
                  </li>
                  <li style={styles.stepItem}>
                    Obtain DISCOM technical feasibility and net-meter installation.
                  </li>
                  <li style={styles.stepItem}>
                    Submit commission certificate; subsidy is credited to bank account.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
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
    marginBottom: '2rem',
  },
  selectorBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1.25rem',
    padding: '1.25rem 1.75rem',
    marginTop: '1.5rem',
  },
  selectorLabelWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  selectorLabel: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--color-deep-evergreen)',
  },
  selectWrapper: {
    minWidth: '240px',
  },
  stateSelect: {
    padding: '0.65rem 1rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--color-deep-evergreen)',
    borderColor: 'var(--color-sage-green)',
  },
  contentArea: {
    marginTop: '1.5rem',
  },
  loadingCard: {
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  resultLayout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.4fr) minmax(300px, 1fr)',
    gap: '2rem',
    alignItems: 'start',
  },
  sidebarColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  sidebarCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  sidebarTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--color-deep-evergreen)',
    margin: 0,
  },
  sidebarText: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.5',
    margin: 0,
  },
  slabList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  slabItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'var(--color-warm-ivory)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-soft-sand)',
    fontSize: '0.84rem',
  },
  slabCapacity: {
    color: 'var(--color-warm-charcoal)',
  },
  slabRate: {
    fontFamily: 'var(--font-headings)',
    fontWeight: '700',
    color: 'var(--color-forest-green)',
  },
  processSteps: {
    margin: 0,
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  stepItem: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.5',
  },
};

// Responsive style hook
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 860px) {
      .container [style*="minmax(0, 1.4fr)"] {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}
