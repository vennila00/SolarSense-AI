/* =========================================================
   SolarSense AI — Login Page
   Minimalist authentication strictly matching /api/auth/login.
   ========================================================= */

import React, { useState } from 'react';
import FormField from '../components/common/FormField';
import AlertBanner from '../components/common/AlertBanner';
import { useAuth } from '../context/AuthContext';
import { SOLAR_IMAGES, FALLBACK_SOLAR_SVG } from '../utils/constants';
import { Sun, Leaf, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage({ navigateTo }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    const errors = {};
    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Please enter your password';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigateTo('dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container" style={styles.cardWrapper}>
        <div className="card" style={styles.authCard}>
          {/* Left Form Area */}
          <div style={styles.formSide}>
            <div style={styles.headerArea}>
              <div style={styles.brandEmblem}>
                <Sun size={17} color="#D7A64A" />
                <Leaf size={14} color="#879B7B" style={{ position: 'absolute', bottom: -2, right: -2 }} />
              </div>
              <h2 style={styles.title}>Welcome back</h2>
              <p style={styles.subtitle}>
                Log in to access your saved rooftop solar assessments and scheme applications.
              </p>
            </div>

            {error && <AlertBanner type="danger" message={error} />}

            <form onSubmit={handleSubmit} noValidate style={styles.form}>
              <FormField
                id="email"
                label="Email Address"
                error={fieldErrors.email}
                required
              >
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                  }}
                  placeholder="name@example.com"
                  className={`form-input ${fieldErrors.email ? 'is-error' : ''}`}
                />
              </FormField>

              <FormField
                id="password"
                label="Password"
                error={fieldErrors.password}
                required
              >
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                    }}
                    placeholder="••••••••"
                    className={`form-input ${fieldErrors.password ? 'is-error' : ''}`}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={styles.submitBtn}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div style={styles.footerNote}>
              <span>Don’t have an account yet?</span>
              <button onClick={() => navigateTo('register')} style={styles.switchLink}>
                Create an account
              </button>
            </div>
          </div>

          {/* Right Photographic Panel (Desktop only) */}
          <div style={styles.imageSide}>
            <img
              src={SOLAR_IMAGES.residentialHouse}
              alt="Sustainable residential home with solar panels"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_SOLAR_SVG;
              }}
              style={styles.sideImg}
            />
            <div style={styles.imageOverlay}>
              <span className="badge badge-moss">Evergreen Solar Living</span>
              <h3 style={styles.overlayQuote}>
                “Clean, quiet sunshine powering the heart of your home.”
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    paddingTop: '3rem',
    paddingBottom: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 140px)',
  },
  cardWrapper: {
    maxWidth: '920px',
  },
  authCard: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 1.2fr) 1fr',
    padding: 0,
    overflow: 'hidden',
  },
  formSide: {
    padding: '3rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerArea: {
    marginBottom: '1.75rem',
  },
  brandEmblem: {
    position: 'relative',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-deep-evergreen)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.75rem',
    color: 'var(--color-deep-evergreen)',
    margin: 0,
    marginBottom: '0.35rem',
  },
  subtitle: {
    fontSize: '0.92rem',
    color: 'var(--color-muted-stone)',
    lineHeight: '1.5',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-muted-stone)',
    padding: '0.2rem',
    display: 'flex',
  },
  submitBtn: {
    width: '100%',
    padding: '0.85rem',
    marginTop: '0.75rem',
  },
  footerNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    marginTop: '1.75rem',
    fontSize: '0.88rem',
    color: 'var(--color-charcoal-subtle)',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: 'var(--color-forest-green)',
    fontWeight: '700',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
    textDecoration: 'underline',
  },
  imageSide: {
    position: 'relative',
    backgroundColor: 'var(--color-deep-evergreen)',
    minHeight: '440px',
  },
  sideImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.85,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '2.5rem 2rem',
    background: 'linear-gradient(to top, rgba(23, 56, 43, 0.95), transparent)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  overlayQuote: {
    color: '#ffffff',
    fontSize: '1.15rem',
    lineHeight: '1.45',
    fontWeight: '600',
    margin: 0,
  },
};

// Responsive mobile breakpoint injection
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 768px) {
      .card[style*="minmax(320px, 1.2fr) 1fr"] {
        grid-template-columns: 1fr !important;
      }
      .card[style*="minmax(320px, 1.2fr) 1fr"] > div:last-child {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}
