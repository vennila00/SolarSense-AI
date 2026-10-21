/* =========================================================
   SolarSense AI — Registration Page
   Strictly matching fields in server/controllers/authControllers.js:
   fullName, email, password, phone, location.
   ========================================================= */

import React, { useState } from 'react';
import FormField from '../components/common/FormField';
import AlertBanner from '../components/common/AlertBanner';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES, SOLAR_IMAGES, FALLBACK_SOLAR_SVG } from '../utils/constants';
import { Sun, Leaf, Lock, Mail, User, Phone, MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function RegisterPage({ navigateTo }) {
  const { register, login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: 'Maharashtra',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.fullName || !formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }

    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Please create a password';
    } else if (formData.password.length < 6) {
      errors.password = 'Password should be at least 6 characters';
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
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        location: formData.location || undefined,
      });

      setSuccess(true);

      // Auto login after registration
      try {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
        navigateTo('dashboard');
      } catch {
        navigateTo('login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please check your information.');
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
              <h2 style={styles.title}>Create your account</h2>
              <p style={styles.subtitle}>
                Join SolarSense AI to save multiple rooftop calculations, track subsidies, and generate exportable reports.
              </p>
            </div>

            {error && <AlertBanner type="danger" message={error} />}
            {success && (
              <AlertBanner
                type="success"
                message="Account registered successfully! Redirecting to your dashboard..."
              />
            )}

            <form onSubmit={handleSubmit} noValidate style={styles.form}>
              <FormField
                id="fullName"
                label="Full Name"
                error={fieldErrors.fullName}
                required
              >
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: null });
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className={`form-input ${fieldErrors.fullName ? 'is-error' : ''}`}
                />
              </FormField>

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
                hint="Min. 6 characters"
                error={fieldErrors.password}
                required
              >
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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

              {/* Two optional fields in two columns: Phone & Location */}
              <div style={styles.twoCols}>
                <FormField id="phone" label="Phone (Optional)">
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="form-input"
                  />
                </FormField>

                <FormField id="location" label="State (Optional)">
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-select"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={styles.submitBtn}
              >
                <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div style={styles.footerNote}>
              <span>Already have an account?</span>
              <button onClick={() => navigateTo('login')} style={styles.switchLink}>
                Sign in
              </button>
            </div>
          </div>

          {/* Right Photographic Panel */}
          <div style={styles.imageSide}>
            <img
              src={SOLAR_IMAGES.heroRooftop}
              alt="Rooftop solar panels under sunlight"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_SOLAR_SVG;
              }}
              style={styles.sideImg}
            />
            <div style={styles.imageOverlay}>
              <span className="badge badge-moss">Residential Clean Energy</span>
              <h3 style={styles.overlayQuote}>
                “Start making your rooftop work for your household today.”
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
    maxWidth: '960px',
  },
  authCard: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 1.25fr) 1fr',
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
    marginBottom: '1.5rem',
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
    fontSize: '0.88rem',
    color: 'var(--color-muted-stone)',
    lineHeight: '1.5',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  twoCols: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
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
    marginTop: '1.5rem',
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
    minHeight: '480px',
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
      .card[style*="minmax(320px, 1.25fr) 1fr"] {
        grid-template-columns: 1fr !important;
      }
      .card[style*="minmax(320px, 1.25fr) 1fr"] > div:last-child {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}
