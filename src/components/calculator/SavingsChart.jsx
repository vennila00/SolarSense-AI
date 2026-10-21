/* =========================================================
   SolarSense AI — 5-Year Cumulative Savings Trajectory Chart
   Uses Chart.js with forest green palette & explicitly stated assumptions.
   ========================================================= */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TrendingUp, Info } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SavingsChart({ annualSavings, finalCost }) {
  const annual = Number(annualSavings);

  if (!annual || annual <= 0) {
    return (
      <div style={styles.chartContainer}>
        <p style={{ color: 'var(--color-muted-stone)', fontSize: '0.9rem' }}>
          Insufficient savings data to plot 5-year trajectory.
        </p>
      </div>
    );
  }

  const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  const cumulativeSavings = years.map((_, idx) => Math.round(annual * (idx + 1)));

  const data = {
    labels: years,
    datasets: [
      {
        type: 'bar',
        label: 'Cumulative Electricity Bill Savings (₹)',
        data: cumulativeSavings,
        backgroundColor: [
          'rgba(135, 155, 123, 0.75)', // Sage
          'rgba(135, 155, 123, 0.9)',
          'rgba(35, 75, 56, 0.85)',   // Forest green
          'rgba(35, 75, 56, 0.95)',
          'rgba(23, 56, 43, 1)',      // Deep evergreen
        ],
        borderColor: '#234B38',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { family: 'Inter', size: 12, weight: 600 },
          color: '#292D28',
        },
      },
      tooltip: {
        backgroundColor: '#17382B',
        titleFont: { family: 'Manrope', size: 13, weight: 700 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (context) => ` Total Savings: ₹${Number(context.raw).toLocaleString('en-IN')}`,
          afterLabel: (context) => {
            if (finalCost && context.raw >= finalCost) {
              return ` ✓ System capital recovered by this period`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
          font: { family: 'Inter', size: 11 },
          color: '#77796F',
        },
        grid: {
          color: 'rgba(237, 232, 220, 0.8)', // Soft sand grid
        },
        border: { dash: [4, 4] },
      },
      x: {
        ticks: {
          font: { family: 'Manrope', size: 12, weight: 600 },
          color: '#292D28',
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div style={styles.chartContainer}>
      <div style={styles.headerRow}>
        <div style={styles.titleWithIcon}>
          <TrendingUp size={18} color="var(--color-forest-green)" />
          <h4 style={styles.chartTitle}>5-Year Cumulative Savings Trajectory</h4>
        </div>
        <span className="badge badge-sage">Projected Return</span>
      </div>

      <div style={styles.chartCanvasArea}>
        <Bar data={data} options={options} />
      </div>

      <div style={styles.assumptionsFooter}>
        <Info size={14} color="var(--color-muted-stone)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={styles.assumptionsText}>
          <strong>Projection Assumption:</strong> Assumes approx. constant electricity tariff and
          consistent annual generation. Does not factor grid tariff inflation, which may further
          accelerate returns.
        </p>
      </div>
    </div>
  );
}

const styles = {
  chartContainer: {
    backgroundColor: 'var(--color-pure-white)',
    border: '1px solid var(--color-soft-sand)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  titleWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  chartTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--color-warm-charcoal)',
    margin: 0,
  },
  chartCanvasArea: {
    height: '240px',
    position: 'relative',
    width: '100%',
  },
  assumptionsFooter: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.45rem',
    backgroundColor: 'var(--color-warm-ivory)',
    padding: '0.65rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-soft-sand)',
  },
  assumptionsText: {
    fontSize: '0.78rem',
    color: 'var(--color-muted-stone)',
    lineHeight: '1.45',
    margin: 0,
  },
};
