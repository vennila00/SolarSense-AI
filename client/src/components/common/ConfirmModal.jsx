/* =========================================================
   SolarSense AI — ConfirmModal Component
   Confirmation dialog for deletion and destructive actions.
   ========================================================= */

import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onCancel} role="dialog" aria-modal="true">
      <div
        style={styles.modal}
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <div style={styles.titleRow}>
            {isDestructive && (
              <div style={styles.iconCircle}>
                <AlertCircle size={20} color="var(--color-danger)" />
              </div>
            )}
            <h3 style={styles.title}>{title}</h3>
          </div>
          <button onClick={onCancel} style={styles.closeBtn} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.message}>{message}</p>
        </div>

        <div style={styles.footer}>
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn btn-secondary btn-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`btn btn-sm ${isDestructive ? 'btn-primary' : 'btn-primary'}`}
            style={
              isDestructive
                ? { backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }
                : {}
            }
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 56, 43, 0.45)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: 'var(--color-pure-white)',
    borderRadius: 'var(--radius-lg)',
    width: '100%',
    maxWidth: '460px',
    boxShadow: 'var(--shadow-modal)',
    border: '1px solid var(--color-soft-sand)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--color-soft-sand)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  iconCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-danger-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--color-warm-charcoal)',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-muted-stone)',
    padding: '0.25rem',
  },
  body: {
    padding: '1.25rem 1.5rem',
  },
  message: {
    fontSize: '0.92rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.5',
    margin: 0,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    backgroundColor: 'var(--color-warm-ivory)',
    borderTop: '1px solid var(--color-soft-sand)',
  },
};
