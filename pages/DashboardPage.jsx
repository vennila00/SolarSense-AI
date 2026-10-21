/* =========================================================
   SolarSense AI — Authenticated User Dashboard
   Displays server history & locally cached estimates distinctly,
   supports viewing estimates and deleting with confirmation.
   ========================================================= */

import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/common/SectionHeading';
import MetricCard from '../components/common/MetricCard';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertBanner from '../components/common/AlertBanner';
import { useAuth } from '../context/AuthContext';
import { solarService } from '../services/solarService';
import {
  getLocalEstimates,
  removeLocalEstimate,
  clearLocalEstimates,
} from '../utils/localEstimateStorage';
import { exportSolarPDF } from '../utils/pdfGenerator';
import {
  formatRupees,
  formatKW,
  formatSqFt,
  formatDate,
  formatUnits,
} from '../utils/formatters';
import {
  Sun,
  Plus,
  Trash2,
  Download,
  Calendar,
  Layers,
  IndianRupee,
  ShieldCheck,
  Eye,
  Database,
  HardDrive,
  User,
  Clock,
} from 'lucide-react';

export default function DashboardPage({ navigateTo, onViewCalculation }) {
  const { user, isAuthenticated } = useAuth();
  const [serverHistory, setServerHistory] = useState([]);
  const [localHistory, setLocalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Deletion modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    isLocal: false,
    loading: false,
  });

  // Load history from both sources on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      // 1. Load local estimates
      const local = getLocalEstimates();
      setLocalHistory(local);

      // 2. Load server calculations if authenticated
      if (isAuthenticated) {
        try {
          const remoteCalculations = await solarService.getHistory();
          setServerHistory(remoteCalculations || []);
        } catch (err) {
          console.warn('Backend history fetch error:', err.message);
          // Backend may be running without MongoDB or history stubbed
          setError(
            'Unable to fetch cloud history from backend database. Showing locally cached estimates.'
          );
        }
      }

      setLoading(false);
    }

    loadData();
  }, [isAuthenticated]);

  const handleDeletePrompt = (item, isLocal) => {
    setDeleteModal({
      isOpen: true,
      item,
      isLocal,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    const { item, isLocal } = deleteModal;
    if (!item) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      if (isLocal) {
        const idToDelete = item.localId || item._id;
        const updated = removeLocalEstimate(idToDelete);
        setLocalHistory(updated);
      } else {
        await solarService.deleteCalculation(item._id);
        setServerHistory((prev) => prev.filter((r) => r._id !== item._id));
      }
      setDeleteModal({ isOpen: false, item: null, isLocal: false, loading: false });
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete calculation: ' + err.message);
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleView = (item) => {
    if (onViewCalculation) {
      onViewCalculation(item);
    }
    navigateTo('calculator');
  };

  const hasAnyRecords = serverHistory.length > 0 || localHistory.length > 0;

  return (
    <div style={styles.pageContainer}>
      {/* Top Welcome Header */}
      <div className="container" style={styles.welcomeArea}>
        <div style={styles.welcomeText}>
          <span className="eyebrow">
            <User size={13} color="#234B38" />
            <span>Homeowner Dashboard</span>
          </span>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {user?.fullName || 'Solar Explorer'}
          </h1>
          <p style={styles.welcomeSub}>
            {user?.email ? `Signed in as ${user.email} • ` : ''}
            Manage your solar sizing records, assess long-term returns, and export formal reports.
          </p>
        </div>

        <button
          onClick={() => navigateTo('calculator')}
          className="btn btn-primary"
          style={styles.newCalcBtn}
        >
          <Plus size={18} />
          <span>New Solar Sizing</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="container" style={styles.contentArea}>
        {loading && (
          <div className="card" style={styles.loadingCard}>
            <LoadingSpinner size={34} text="Loading saved solar calculations..." />
          </div>
        )}

        {error && (
          <AlertBanner type="warning" message={error} style={{ marginBottom: '1.5rem' }} />
        )}

        {!loading && !hasAnyRecords && (
          <EmptyState
            icon={Sun}
            title="No Solar Calculations Yet"
            description="You haven’t created any solar sizing estimates yet. Enter your electricity usage and rooftop dimensions to see system capacity and subsidy options."
            actionText="Start My First Estimate"
            onAction={() => navigateTo('calculator')}
          />
        )}

        {!loading && hasAnyRecords && (
          <div style={styles.tablesWrapper}>
            {/* 1. Cloud / Server-Saved Calculations (MongoDB) */}
            <div style={styles.sectionBlock}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitleRow}>
                  <Database size={18} color="var(--color-forest-green)" />
                  <h3 style={styles.sectionTitle}>Cloud Saved Calculations (MongoDB)</h3>
                </div>
                <span className="badge badge-forest">
                  {serverHistory.length} {serverHistory.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>

              {serverHistory.length === 0 ? (
                <div style={styles.subEmptyBox}>
                  <p style={styles.subEmptyText}>
                    No records currently stored in your cloud database account. Any calculations
                    performed will appear here once saved to the server.
                  </p>
                </div>
              ) : (
                <div style={styles.tableResponsive}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Location</th>
                        <th style={styles.th}>System Size</th>
                        <th style={styles.th}>Net Cost</th>
                        <th style={styles.th}>Annual Savings</th>
                        <th style={styles.th}>Subsidy</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serverHistory.map((item) => (
                        <tr key={item._id} style={styles.tr}>
                          <td style={styles.td}>{formatDate(item.createdAt)}</td>
                          <td style={styles.td}>
                            <strong>{item.location}</strong>
                          </td>
                          <td style={styles.td}>{formatKW(item.recommendedCapacity)}</td>
                          <td style={styles.td}>
                            <strong>{formatRupees(item.finalCost)}</strong>
                          </td>
                          <td style={styles.td}>{formatRupees(item.annualSavings)}</td>
                          <td style={styles.td}>
                            <span className="badge badge-sage">
                              {formatRupees(item.subsidy)}
                            </span>
                          </td>
                          <td style={{ ...styles.td, textAlign: 'right' }}>
                            <div style={styles.actionsGroup}>
                              <button
                                onClick={() => handleView(item)}
                                style={styles.iconBtn}
                                title="View in Calculator"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => exportSolarPDF(item)}
                                style={styles.iconBtn}
                                title="Download PDF"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={() => handleDeletePrompt(item, false)}
                                style={{ ...styles.iconBtn, color: 'var(--color-danger)' }}
                                title="Delete from Cloud"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 2. Locally Cached Browser Estimates */}
            {localHistory.length > 0 && (
              <div style={styles.sectionBlock}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionTitleRow}>
                    <HardDrive size={18} color="var(--color-sage-green)" />
                    <h3 style={styles.sectionTitle}>Locally Cached Estimates (Browser Session)</h3>
                  </div>
                  <span className="badge badge-moss">Local Storage</span>
                </div>

                <div style={styles.noticeNoticeBox}>
                  <p style={styles.noticeNoticeText}>
                    <strong>Note:</strong> These estimates are cached locally in your current
                    browser session. They are not stored on the cloud server.
                  </p>
                </div>

                <div style={styles.tableResponsive}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Location</th>
                        <th style={styles.th}>System Size</th>
                        <th style={styles.th}>Net Cost</th>
                        <th style={styles.th}>Annual Savings</th>
                        <th style={styles.th}>Storage</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localHistory.map((item) => (
                        <tr key={item.localId || item._id} style={styles.tr}>
                          <td style={styles.td}>{formatDate(item.createdAt)}</td>
                          <td style={styles.td}>
                            <strong>{item.location}</strong>
                          </td>
                          <td style={styles.td}>{formatKW(item.recommendedCapacity)}</td>
                          <td style={styles.td}>
                            <strong>{formatRupees(item.finalCost)}</strong>
                          </td>
                          <td style={styles.td}>{formatRupees(item.annualSavings)}</td>
                          <td style={styles.td}>
                            <span className="badge badge-moss">Local Cache</span>
                          </td>
                          <td style={{ ...styles.td, textAlign: 'right' }}>
                            <div style={styles.actionsGroup}>
                              <button
                                onClick={() => handleView(item)}
                                style={styles.iconBtn}
                                title="View in Calculator"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => exportSolarPDF(item)}
                                style={styles.iconBtn}
                                title="Download PDF"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={() => handleDeletePrompt(item, true)}
                                style={{ ...styles.iconBtn, color: 'var(--color-danger)' }}
                                title="Remove from Local Cache"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Deletion */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={
          deleteModal.isLocal
            ? 'Remove Local Estimate?'
            : 'Delete Saved Calculation?'
        }
        message={
          deleteModal.isLocal
            ? 'This will remove the selected estimate from your local browser cache. It will not affect any cloud accounts.'
            : 'Are you sure you want to delete this calculation from your server database? This action cannot be undone.'
        }
        confirmText="Delete"
        loading={deleteModal.loading}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteModal({ isOpen: false, item: null, isLocal: false, loading: false })
        }
      />
    </div>
  );
}

const styles = {
  pageContainer: {
    paddingTop: '2.5rem',
    paddingBottom: '5rem',
  },
  welcomeArea: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  welcomeText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    maxWidth: '680px',
  },
  welcomeTitle: {
    color: 'var(--color-deep-evergreen)',
    margin: 0,
  },
  welcomeSub: {
    fontSize: '0.95rem',
    color: 'var(--color-charcoal-subtle)',
    margin: 0,
    lineHeight: '1.5',
  },
  newCalcBtn: {
    padding: '0.75rem 1.4rem',
  },
  contentArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  loadingCard: {
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  tablesWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  sectionBlock: {
    backgroundColor: 'var(--color-pure-white)',
    border: '1px solid var(--color-soft-sand)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.75rem',
    boxShadow: 'var(--shadow-subtle)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--color-deep-evergreen)',
    margin: 0,
  },
  subEmptyBox: {
    backgroundColor: 'var(--color-warm-ivory)',
    border: '1px dashed var(--color-soft-sand-dark)',
    borderRadius: 'var(--radius-md)',
    padding: '2rem',
    textAlign: 'center',
  },
  subEmptyText: {
    fontSize: '0.88rem',
    color: 'var(--color-muted-stone)',
    margin: 0,
  },
  noticeNoticeBox: {
    backgroundColor: 'var(--color-warm-ivory)',
    border: '1px solid var(--color-soft-sand)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.65rem 0.95rem',
    marginBottom: '1rem',
  },
  noticeNoticeText: {
    fontSize: '0.8rem',
    color: 'var(--color-muted-stone)',
    margin: 0,
  },
  tableResponsive: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--color-muted-stone)',
    padding: '0.85rem 1rem',
    borderBottom: '1px solid var(--color-soft-sand-dark)',
  },
  tr: {
    borderBottom: '1px solid var(--color-soft-sand)',
    transition: 'background-color var(--transition-fast)',
  },
  td: {
    padding: '1rem',
    fontSize: '0.9rem',
    color: 'var(--color-warm-charcoal)',
    verticalAlign: 'middle',
  },
  actionsGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.45rem',
  },
  iconBtn: {
    background: 'none',
    border: '1px solid var(--color-soft-sand)',
    borderRadius: '6px',
    padding: '0.4rem',
    cursor: 'pointer',
    color: 'var(--color-forest-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
  },
};
