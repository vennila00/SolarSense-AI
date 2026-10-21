/* =========================================================
   SolarSense AI — Solar Results Dashboard
   Comprehensive breakdown of technical sizing, finances, trajectory & PDF export.
   ========================================================= */

import React from 'react';
import MetricCard from '../common/MetricCard';
import SavingsChart from './SavingsChart';
import AIAdvicePanel from './AIAdvicePanel';
import { exportSolarPDF } from '../../utils/pdfGenerator';
import {
  formatRupees,
  formatKW,
  formatSqFt,
  formatUnits,
  formatTons,
} from '../../utils/formatters';
import { DISCLAIMER_TEXT } from '../../utils/constants';
import {
  Download,
  Sun,
  IndianRupee,
  Calendar,
  Layers,
  Leaf,
  Maximize2,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function SolarResultsDashboard({ result, isLocallyCached = false }) {
  if (!result) return null;

  const annualSavings = Number(result.annualSavings) || 0;
  const fiveYearSavings = annualSavings > 0 ? annualSavings * 5 : 0;

  const handleExport = () => {
    exportSolarPDF(result);
  };

  return (
    <div style={styles.dashboardContainer} className="animate-fade-in">
      {/* Top Banner: Status & Export Button */}
      <div style={styles.topBar}>
        <div style={styles.titleInfo}>
          <div style={styles.badgeRow}>
            <span className="badge badge-forest">System Assessment</span>
            {isLocallyCached && (
              <span className="badge badge-sage">Cached in Session</span>
            )}
          </div>
          <h3 style={styles.dashboardTitle}>
            Rooftop Solar Recommendation for {result.location || 'Your Home'}
          </h3>
          <p style={styles.dashboardSubtitle}>
            Based on monthly consumption of ~{formatRupees(result.monthlyBill)} on a {formatSqFt(result.roofArea)} rooftop.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="btn btn-secondary btn-sm"
          style={styles.exportBtn}
        >
          <Download size={15} />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Primary Highlights Row (Inspired by Reference Image 3 EcoSync Energy Dashboard) */}
      <div style={styles.highlightsGrid}>
        {/* Recommended Capacity Card (Forest Green Accent) */}
        <MetricCard
          variant="forest"
          label="Recommended System Capacity"
          value={formatKW(result.recommendedCapacity)}
          subtext={`${result.numberOfPanels || '—'} Standard 550W Panels required`}
          icon={Sun}
          badge="Optimal Size"
        />

        {/* Net Out-of-Pocket Cost Card */}
        <MetricCard
          variant="default"
          label="Net Out-of-Pocket Cost"
          value={formatRupees(result.finalCost)}
          subtext={
            result.subsidy && result.subsidy > 0
              ? `After ₹${Number(result.subsidy).toLocaleString('en-IN')} PM Surya Ghar subsidy`
              : 'Before applicable central/state incentives'
          }
          icon={IndianRupee}
          badge={result.subsidy > 0 ? 'Subsidy Applied' : undefined}
        />

        {/* Annual Electricity Savings Card */}
        <MetricCard
          variant="default"
          label="Estimated Annual Bill Savings"
          value={formatRupees(result.annualSavings)}
          subtext={`~${formatRupees(result.monthlySavings)} saved per month (~90% grid offset)`}
          icon={Calendar}
          badge="Estimated"
        />

        {/* Payback Period Card */}
        <MetricCard
          variant="moss"
          label="Estimated Capital Payback"
          value={result.paybackPeriod ? `${result.paybackPeriod} Years` : '—'}
          subtext="25+ year estimated module service life"
          icon={Clock}
          badge="ROI"
        />
      </div>

      {/* Financial Breakdown Table Card */}
      <div className="card" style={styles.detailsCard}>
        <h4 style={styles.sectionHeading}>Financial Cost & Subsidy Breakdown</h4>
        <div style={styles.metricsTwoColumn}>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel}>Gross Turnkey Installation Cost:</span>
            <span style={styles.breakdownValue}>{formatRupees(result.installationCost)}</span>
          </div>

          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel}>Central CFA Subsidy (PM Surya Ghar):</span>
            <span style={{ ...styles.breakdownValue, color: 'var(--color-forest-green)' }}>
              - {formatRupees(result.subsidy)}
            </span>
          </div>

          <div style={{ ...styles.breakdownRow, borderTop: '1px solid var(--color-soft-sand)', paddingTop: '0.65rem' }}>
            <span style={{ ...styles.breakdownLabel, fontWeight: '700', color: 'var(--color-deep-evergreen)' }}>
              Net Payable System Investment:
            </span>
            <span style={{ ...styles.breakdownValue, fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-forest-green)' }}>
              {formatRupees(result.finalCost)}
            </span>
          </div>

          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel}>5-Year Projected Cumulative Savings:</span>
            <span style={{ ...styles.breakdownValue, color: 'var(--color-warm-charcoal)' }}>
              {formatRupees(fiveYearSavings)}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div style={styles.techGrid}>
        <div style={styles.techItem}>
          <div style={styles.techIconWrap}>
            <Layers size={18} color="var(--color-forest-green)" />
          </div>
          <div>
            <span style={styles.techLabel}>Monthly Energy Generation</span>
            <span style={styles.techValue}>{formatUnits(result.monthlyUnits)}</span>
            <span style={styles.techNote}>Based on regional solar irradiation</span>
          </div>
        </div>

        <div style={styles.techItem}>
          <div style={styles.techIconWrap}>
            <Maximize2 size={18} color="var(--color-forest-green)" />
          </div>
          <div>
            <span style={styles.techLabel}>Required Rooftop Footprint</span>
            <span style={styles.techValue}>{formatSqFt(result.roofRequired)}</span>
            <span style={styles.techNote}>
              {result.roofArea >= result.roofRequired
                ? `✓ Fits within your ${formatSqFt(result.roofArea)} roof`
                : '⚠ Exceeds specified rooftop footprint'}
            </span>
          </div>
        </div>

        <div style={styles.techItem}>
          <div style={styles.techIconWrap}>
            <Leaf size={18} color="var(--color-forest-green)" />
          </div>
          <div>
            <span style={styles.techLabel}>Annual CO₂ Avoided</span>
            <span style={styles.techValue}>{formatTons(result.co2Reduction)}</span>
            <span style={styles.techNote}>Equivalent to grid coal emission mitigation</span>
          </div>
        </div>
      </div>

      {/* 5-Year Cumulative Savings Trajectory Chart */}
      <SavingsChart annualSavings={result.annualSavings} finalCost={result.finalCost} />

      {/* AI Scheme Advisor Panel (if aiAdvice returned by controller) */}
      {result.aiAdvice && (
        <AIAdvicePanel aiAdvice={result.aiAdvice} location={result.location} />
      )}

      {/* Disclaimer strip */}
      <p style={styles.disclaimerText}>
        <strong>Note on Estimates:</strong> {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  topBar: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    borderBottom: '1px solid var(--color-soft-sand)',
    paddingBottom: '1.25rem',
  },
  titleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  badgeRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  dashboardTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
    fontWeight: '800',
    color: 'var(--color-deep-evergreen)',
    margin: 0,
  },
  dashboardSubtitle: {
    fontSize: '0.88rem',
    color: 'var(--color-muted-stone)',
    margin: 0,
  },
  exportBtn: {
    padding: '0.65rem 1.15rem',
    fontSize: '0.88rem',
  },
  highlightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '1rem',
  },
  detailsCard: {
    padding: '1.5rem',
  },
  sectionHeading: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--color-warm-charcoal)',
    marginBottom: '1rem',
  },
  metricsTwoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem 2rem',
  },
  breakdownRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.35rem 0',
  },
  breakdownLabel: {
    fontSize: '0.9rem',
    color: 'var(--color-charcoal-subtle)',
  },
  breakdownValue: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--color-warm-charcoal)',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  techItem: {
    backgroundColor: 'var(--color-pure-white)',
    border: '1px solid var(--color-soft-sand)',
    borderRadius: 'var(--radius-md)',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem',
  },
  techIconWrap: {
    padding: '0.45rem',
    borderRadius: '8px',
    backgroundColor: 'var(--color-soft-moss)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  techLabel: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--color-muted-stone)',
  },
  techValue: {
    display: 'block',
    fontFamily: 'var(--font-headings)',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--color-warm-charcoal)',
    margin: '0.2rem 0',
  },
  techNote: {
    display: 'block',
    fontSize: '0.78rem',
    color: 'var(--color-charcoal-subtle)',
  },
  disclaimerText: {
    fontSize: '0.78rem',
    color: 'var(--color-muted-stone)',
    lineHeight: '1.5',
    margin: 0,
  },
};
