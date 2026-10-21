/* =========================================================
   SolarSense AI — Main Application Shell & View Router
   Evergreen Solar Living frontend with hash-synchronized navigation.
   ========================================================= */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import SchemesPage from './pages/SchemesPage';
import SustainabilityPage from './pages/SustainabilityPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Helper to parse initial view from URL hash
  const getViewFromHash = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validViews = ['home', 'calculator', 'schemes', 'sustainability', 'dashboard', 'login', 'register'];
    return validViews.includes(hash) ? hash : 'home';
  };

  const [currentView, setCurrentView] = useState(getViewFromHash);
  const [activeCalculation, setActiveCalculation] = useState(null);

  // Sync state when browser Back/Forward is clicked
  useEffect(() => {
    const handleHashChange = () => {
      const nextView = getViewFromHash();
      setCurrentView(nextView);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Programmatic navigation helper
  const navigateTo = (view) => {
    window.location.hash = `#${view}`;
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // Callback when a calculation is created or loaded
  const handleCalculationComplete = (calc) => {
    setActiveCalculation(calc);
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;

      case 'calculator':
        return (
          <CalculatorPage
            initialCalculation={activeCalculation}
            onCalculationComplete={handleCalculationComplete}
          />
        );

      case 'schemes':
        return (
          <SchemesPage
            initialLocation={activeCalculation?.location || 'Maharashtra'}
          />
        );

      case 'sustainability':
        return (
          <SustainabilityPage
            calculationResult={activeCalculation}
            navigateTo={navigateTo}
          />
        );

      case 'dashboard':
        if (!isAuthenticated && !authLoading) {
          // Protected route behavior: if not logged in, show Login page with notice
          return <LoginPage navigateTo={navigateTo} />;
        }
        return (
          <DashboardPage
            navigateTo={navigateTo}
            onViewCalculation={(calc) => setActiveCalculation(calc)}
          />
        );

      case 'login':
        return <LoginPage navigateTo={navigateTo} />;

      case 'register':
        return <RegisterPage navigateTo={navigateTo} />;

      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div style={styles.appWrapper}>
      {/* Top Navigation */}
      <Navbar currentView={currentView} navigateTo={navigateTo} />

      {/* Main Page Content */}
      <main style={styles.mainArea}>
        {renderView()}
      </main>

      {/* Footer */}
      <Footer navigateTo={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  appWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-warm-ivory)',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
};