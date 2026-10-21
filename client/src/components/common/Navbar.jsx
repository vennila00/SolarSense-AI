/* =========================================================
   SolarSense AI — Navigation Bar
   Slim, elegant navigation with responsive mobile menu & auth state.
   ========================================================= */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sun, Leaf, Menu, X, User, LogOut, ArrowRight } from 'lucide-react';

export default function Navbar({ currentView, navigateTo }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'calculator', label: 'Solar Calculator' },
    { id: 'schemes', label: 'Government Schemes' },
    { id: 'sustainability', label: 'Sustainability' },
  ];

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          style={styles.brandButton}
          aria-label="SolarSense AI Home"
        >
          <div style={styles.brandIconContainer}>
            <Sun size={17} color="#D7A64A" style={styles.sunIcon} />
            <Leaf size={14} color="#879B7B" style={styles.leafIcon} />
          </div>
          <div style={styles.brandText}>
            <span style={styles.brandName}>SolarSense</span>
            <span style={styles.brandTag}>AI</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav style={styles.desktopNav} aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                style={{
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                }}
              >
                {link.label}
                {isActive && <span style={styles.activeDot} />}
              </button>
            );
          })}
        </nav>

        {/* Right Action / Auth Area */}
        <div style={styles.rightArea}>
          {isAuthenticated ? (
            <div style={styles.userProfileArea}>
              <button
                onClick={() => handleNav('dashboard')}
                style={{
                  ...styles.dashboardBtn,
                  ...(currentView === 'dashboard' ? styles.dashboardBtnActive : {}),
                }}
                title="View Saved Calculations"
              >
                <User size={15} />
                <span>{user?.fullName?.split(' ')[0] || 'Dashboard'}</span>
              </button>

              <button
                onClick={logout}
                style={styles.logoutBtn}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={styles.authButtonsGroup}>
              <button
                onClick={() => handleNav('login')}
                style={styles.loginBtn}
              >
                Login
              </button>
              <button
                onClick={() => handleNav('calculator')}
                className="btn btn-primary btn-sm"
                style={styles.primaryCta}
              >
                <span>Calculate Savings</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={styles.mobileMenuToggle}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} className="animate-fade-in">
          <nav style={styles.mobileNav}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                style={{
                  ...styles.mobileNavLink,
                  ...(currentView === link.id ? styles.mobileNavLinkActive : {}),
                }}
              >
                {link.label}
              </button>
            ))}

            <div style={styles.mobileDivider} />

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  style={{
                    ...styles.mobileNavLink,
                    ...(currentView === 'dashboard' ? styles.mobileNavLinkActive : {}),
                  }}
                >
                  <User size={16} />
                  <span>My Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  style={{ ...styles.mobileNavLink, color: 'var(--color-danger)' }}
                >
                  <LogOut size={16} />
                  <span>Log Out ({user?.email})</span>
                </button>
              </>
            ) : (
              <div style={styles.mobileAuthRow}>
                <button
                  onClick={() => handleNav('login')}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('calculator')}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  Calculate Savings
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(248, 247, 240, 0.94)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--color-soft-sand)',
    transition: 'background-color var(--transition-base)',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  },
  brandButton: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    cursor: 'pointer',
    padding: '0.25rem 0',
  },
  brandIconContainer: {
    position: 'relative',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-deep-evergreen)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunIcon: {
    position: 'relative',
    zIndex: 2,
  },
  leafIcon: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    zIndex: 3,
  },
  brandText: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.2rem',
  },
  brandName: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--color-deep-evergreen)',
    letterSpacing: '-0.03em',
  },
  brandTag: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--color-forest-green)',
    backgroundColor: 'var(--color-soft-moss)',
    padding: '0.1rem 0.35rem',
    borderRadius: '4px',
    letterSpacing: '0.04em',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.75rem',
  },
  navLink: {
    position: 'relative',
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-headings)',
    fontSize: '0.92rem',
    fontWeight: '500',
    color: 'var(--color-warm-charcoal)',
    cursor: 'pointer',
    padding: '0.4rem 0',
    transition: 'color var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  navLinkActive: {
    fontWeight: '700',
    color: 'var(--color-forest-green)',
  },
  activeDot: {
    position: 'absolute',
    bottom: '-4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
  },
  rightArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  authButtonsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  loginBtn: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-headings)',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--color-forest-green)',
    cursor: 'pointer',
    padding: '0.5rem 0.85rem',
    borderRadius: 'var(--radius-pill)',
    transition: 'background-color var(--transition-fast)',
  },
  primaryCta: {
    boxShadow: '0 2px 8px rgba(35, 75, 56, 0.15)',
  },
  userProfileArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  dashboardBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontFamily: 'var(--font-headings)',
    fontSize: '0.88rem',
    fontWeight: '600',
    color: 'var(--color-forest-green)',
    backgroundColor: 'var(--color-pure-white)',
    border: '1px solid var(--color-soft-sand-dark)',
    borderRadius: 'var(--radius-pill)',
    padding: '0.45rem 0.95rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  dashboardBtnActive: {
    backgroundColor: 'var(--color-forest-green)',
    color: '#ffffff',
    borderColor: 'var(--color-forest-green)',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid var(--color-soft-sand-dark)',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--color-muted-stone)',
    transition: 'all var(--transition-fast)',
  },
  mobileMenuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-deep-evergreen)',
    padding: '0.4rem',
  },
  mobileDrawer: {
    backgroundColor: 'var(--color-warm-ivory)',
    borderBottom: '1px solid var(--color-soft-sand)',
    padding: '1.25rem 1.5rem',
    boxShadow: 'var(--shadow-card)',
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  mobileNavLink: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-headings)',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--color-warm-charcoal)',
    textAlign: 'left',
    padding: '0.6rem 0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  mobileNavLinkActive: {
    color: 'var(--color-forest-green)',
    fontWeight: '700',
  },
  mobileDivider: {
    height: '1px',
    backgroundColor: 'var(--color-soft-sand)',
    margin: '0.5rem 0',
  },
  mobileAuthRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
    marginTop: '0.5rem',
  },
};

// CSS media query style hook injection for mobile breakpoint
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 860px) {
      header nav[aria-label="Main Navigation"] { display: none !important; }
      header button[aria-label="Open Menu"],
      header button[aria-label="Close Menu"] { display: flex !important; }
      header .btn-primary { display: none !important; }
    }
  `;
  document.head.appendChild(styleEl);
}
