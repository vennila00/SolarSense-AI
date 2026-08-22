import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

export default function App() {
  const [location, setLocation] = useState('Maharashtra');
  const [monthlyBill, setMonthlyBill] = useState(3000);
  const [roofArea, setRoofArea] = useState(500);
  const [electricityTariff, setElectricityTariff] = useState(8);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const payload = {
      location,
      monthlyBill: Number(monthlyBill),
      roofArea: Number(roofArea),
      electricityTariff: Number(electricityTariff),
    };

    try {
      const response = await fetch('http://localhost:5000/api/solar/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Server error');
      setResult(data.calculation);
    } catch (err) {
      console.error(err);
      alert('Calculation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prepare 5-Year Cumulative Savings Chart Data
  const getChartData = () => {
    if (!result) return null;
    const annual = Number(result.annualSavings) || 0;
    const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    const cumulativeSavings = years.map((_, idx) => Math.round(annual * (idx + 1)));

    return {
      labels: years,
      datasets: [
        {
          type: 'bar',
          label: 'Cumulative Savings (₹)',
          data: cumulativeSavings,
          backgroundColor: 'rgba(2, 132, 199, 0.85)',
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { boxWidth: 12, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` Total Savings: ₹${context.raw.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
          font: { size: 11 },
        },
        grid: { color: '#f1f5f9' },
      },
      x: {
        grid: { display: false },
        font: { size: 12 },
      },
    },
  };

  const handleExportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();

    doc.setFillColor(2, 132, 199);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('SolarSense AI — Feasibility Report', 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const dateStr = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Generated on: ${dateStr}`, 14, 38);
    doc.text(`Target Region / State: ${result.location}`, 14, 44);

    autoTable(doc, {
      startY: 50,
      head: [['Input Parameter', 'Value Entered']],
      body: [
        ['Monthly Electricity Bill', `₹${result.monthlyBill.toLocaleString()}`],
        ['Available Roof Area', `${result.roofArea} sq. ft.`],
        ['Electricity Tariff', `₹${result.electricityTariff} / unit`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [['System Metric', 'Estimated Output']],
      body: [
        ['Recommended System Capacity', `${result.recommendedCapacity} kW`],
        ['Estimated Number of Panels', `${result.numberOfPanels} Panels`],
        ['Monthly Energy Generation', `${result.monthlyUnits} kWh (Units)`],
        ['Required Roof Footprint', `${result.roofRequired} sq. ft.`],
        ['CO2 Emissions Mitigated', `${result.co2Reduction} Tons / Year`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [2, 132, 199] },
      styles: { fontSize: 9 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [['Financial Breakdown', 'Amount (INR)']],
      body: [
        ['Gross Installation Cost', `₹${result.installationCost.toLocaleString()}`],
        ['Estimated Subsidy', `- ₹${result.subsidy.toLocaleString()}`],
        ['Net Out-of-Pocket Cost', `₹${result.finalCost.toLocaleString()}`],
        ['Estimated Annual Savings', `₹${result.annualSavings.toLocaleString()}`],
        ['5-Year Projected Savings', `₹${(result.annualSavings * 5).toLocaleString()}`],
        ['Payback Period', `${result.paybackPeriod} Years`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [25, 135, 84] },
      styles: { fontSize: 9 },
    });

    if (result.aiAdvice) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [['AI Scheme & Regulatory Guidance', 'Details']],
        body: [
          ['Recommended Scheme', result.aiAdvice.schemeName || 'PM Surya Ghar Scheme'],
          ['AI Assessment', result.aiAdvice.summary || 'Eligible for standard rooftop subsidies.'],
          ['State Guidelines', result.aiAdvice.stateTips || 'Verify vendor empanelment.'],
          ['Required Documents', result.aiAdvice.documents?.join(', ') || 'ID, Utility Bill, Tax Receipt'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [109, 40, 217] },
        styles: { fontSize: 9 },
      });
    }

    doc.save(`SolarSense_Report_${result.location}_${Date.now()}.pdf`);
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={styles.brandIcon}>⚡</span>
          <span style={styles.brandName}>SolarSense AI</span>
        </div>
        <span style={styles.badge}>Smart Energy Planner</span>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.grid}>
          {/* Form */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>System Estimator</h2>
              <p style={styles.cardSubtitle}>Enter property details to get sizing, ROI charts, and AI advice.</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>State / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Maharashtra, Tamil Nadu"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Monthly Electricity Bill (₹)</label>
                <input
                  type="number"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(e.target.value)}
                  min="100"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.rowTwoCols}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Roof Area (sq. ft.)</label>
                  <input
                    type="number"
                    value={roofArea}
                    onChange={(e) => setRoofArea(e.target.value)}
                    min="50"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Tariff (₹/Unit)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={electricityTariff}
                    onChange={(e) => setElectricityTariff(e.target.value)}
                    min="1"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} style={styles.submitBtn}>
                {loading ? 'Analyzing Solar Data...' : '⚡ Generate Solar Plan'}
              </button>
            </form>
          </section>

          {/* Results */}
          <section style={styles.card}>
            <div style={{ ...styles.cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={styles.cardTitle}>System Recommendation</h2>
                <p style={styles.cardSubtitle}>
                  {result ? `Calculated estimates for ${result.location}` : 'Submit the form to generate sizing and ROI details.'}
                </p>
              </div>

              {result && (
                <button onClick={handleExportPDF} style={styles.pdfBtn}>
                  📄 Export PDF
                </button>
              )}
            </div>

            {!result && !loading && (
              <div style={styles.emptyState}>
                <span style={{ fontSize: '3rem' }}>☀️</span>
                <p style={{ color: '#6c757d', marginTop: '1rem' }}>
                  No calculations yet. Enter your electricity usage and click calculate.
                </p>
              </div>
            )}

            {loading && (
              <div style={styles.emptyState}>
                <div style={styles.spinner}></div>
                <p style={{ color: '#0284c7', marginTop: '1rem', fontWeight: 'bold' }}>Running solar sizing models...</p>
              </div>
            )}

            {result && (
              <div>
                <div style={styles.highlightRow}>
                  <div style={styles.highlightCard}>
                    <span style={styles.highlightLabel}>Recommended Size</span>
                    <span style={styles.highlightValue}>{result.recommendedCapacity} kW</span>
                    <span style={styles.highlightSub}>{result.numberOfPanels} Standard Panels</span>
                  </div>

                  <div style={{ ...styles.highlightCard, borderColor: '#198754', backgroundColor: '#f0fdf4' }}>
                    <span style={styles.highlightLabel}>Net Final Cost</span>
                    <span style={{ ...styles.highlightValue, color: '#198754' }}>₹{result.finalCost.toLocaleString()}</span>
                    <span style={styles.highlightSub}>₹{result.subsidy.toLocaleString()} Subsidy Applied</span>
                  </div>
                </div>

                <div style={styles.metricsGrid}>
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>Monthly Generation</span>
                    <span style={styles.metricVal}>{result.monthlyUnits} kWh</span>
                  </div>
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>Roof Space Needed</span>
                    <span style={styles.metricVal}>{result.roofRequired} sq. ft.</span>
                  </div>
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>Gross Installation</span>
                    <span style={styles.metricVal}>₹{result.installationCost.toLocaleString()}</span>
                  </div>
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>Annual Cost Savings</span>
                    <span style={styles.metricVal}>₹{result.annualSavings.toLocaleString()}</span>
                  </div>
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>Payback Period</span>
                    <span style={styles.metricVal}>{result.paybackPeriod} Years</span>
                  </div>
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>CO₂ Mitigation</span>
                    <span style={styles.metricVal}>{result.co2Reduction} Tons/yr</span>
                  </div>
                </div>

                {/* Interactive Chart Component */}
                <div style={styles.chartWrapper}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.95rem' }}>
                    📈 5-Year Cumulative Savings Trajectory
                  </h4>
                  <div style={{ height: '220px', position: 'relative' }}>
                    <Bar data={getChartData()} options={chartOptions} />
                  </div>
                </div>

                {/* AI Scheme Box */}
                {result.aiAdvice && (
                  <div style={styles.aiBox}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>✨</span>
                      <strong style={{ color: '#5b21b6', fontSize: '1rem' }}>
                        AI Advisor: {result.aiAdvice.schemeName}
                      </strong>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#4c1d95', margin: '0 0 0.75rem 0', lineHeight: '1.4' }}>
                      {result.aiAdvice.summary}
                    </p>

                    <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.75rem', border: '1px solid #ddd6fe' }}>
                      <strong style={{ fontSize: '0.8rem', color: '#5b21b6' }}>📍 State & DISCOM Guidance:</strong>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#4b5563' }}>
                        {result.aiAdvice.stateTips}
                      </p>
                    </div>

                    {result.aiAdvice.documents && (
                      <div>
                        <strong style={{ fontSize: '0.8rem', color: '#5b21b6' }}>📋 Checklist for Application:</strong>
                        <ul style={{ margin: '0.3rem 0 0 1rem', padding: 0, fontSize: '0.85rem', color: '#4b5563' }}>
                          {result.aiAdvice.documents.map((doc, idx) => (
                            <li key={idx} style={{ marginBottom: '0.2rem' }}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1e293b',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  brandIcon: { fontSize: '1.5rem' },
  brandName: { fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' },
  badge: { fontSize: '0.8rem', padding: '0.35rem 0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '9999px', fontWeight: '600' },
  mainContent: { maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', alignItems: 'start' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0' },
  cardHeader: { marginBottom: '1.5rem' },
  cardTitle: { margin: 0, fontSize: '1.35rem', fontWeight: '700', color: '#0f172a' },
  cardSubtitle: { margin: '0.35rem 0 0 0', fontSize: '0.9rem', color: '#64748b' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  rowTwoCols: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#334155' },
  input: { padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f8fafc' },
  submitBtn: { marginTop: '0.5rem', padding: '0.85rem', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  pdfBtn: { padding: '0.5rem 1rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' },
  highlightRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  highlightCard: { padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  highlightLabel: { fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: '#64748b' },
  highlightValue: { fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' },
  highlightSub: { fontSize: '0.8rem', color: '#64748b' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' },
  metricItem: { padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  metricLabel: { fontSize: '0.8rem', color: '#64748b' },
  metricVal: { fontSize: '1rem', fontWeight: '700', color: '#1e293b' },
  chartWrapper: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' },
  aiBox: { backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '1.25rem' },
};