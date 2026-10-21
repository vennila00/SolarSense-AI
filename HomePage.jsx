/* =========================================================
   SolarSense AI — Landing Page (HomePage)
   Evergreen Solar Living aesthetic with real rooftop photography & editorial layout.
   Matches Reference Images 1 & 2.
   ========================================================= */

import React from 'react';
import SectionHeading from '../components/common/SectionHeading';
import { SOLAR_IMAGES, FALLBACK_SOLAR_SVG } from '../utils/constants';
import {
  Sun,
  Zap,
  ShieldCheck,
  TrendingUp,
  Leaf,
  ArrowRight,
  CheckCircle2,
  Home,
  BarChart3,
  Coins,
} from 'lucide-react';

export default function HomePage({ navigateTo }) {
  return (
    <div style={styles.pageWrapper}>
      {/* 1. HERO SECTION (Split Editorial Layout) */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroGrid}>
          {/* Left Column: Editorial Headline & Actions */}
          <div style={styles.heroLeft}>
            <span className="eyebrow">
              <Sun size={14} color="#D7A64A" />
              <span>A smarter way to go solar</span>
            </span>

            <h1 style={styles.heroHeadline}>
              Make your rooftop <br />
              <span style={styles.highlightText}>work for you.</span>
            </h1>

            <p style={styles.heroSupportText}>
              Discover the right solar system for your home, understand your potential savings,
              and explore government subsidies — all in one place.
            </p>

            <div style={styles.heroActions}>
              <button
                onClick={() => navigateTo('calculator')}
                className="btn btn-primary btn-lg"
              >
                <span>Calculate My Savings</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('benefits-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-secondary btn-lg"
              >
                Explore Solar Benefits
              </button>
            </div>

            {/* Quick reassurance checkmarks */}
            <div style={styles.reassuranceRow}>
              <div style={styles.reassuranceItem}>
                <CheckCircle2 size={15} color="var(--color-sage-green)" />
                <span>Instant sizing algorithm</span>
              </div>
              <div style={styles.reassuranceItem}>
                <CheckCircle2 size={15} color="var(--color-sage-green)" />
                <span>PM Surya Ghar subsidy rules</span>
              </div>
              <div style={styles.reassuranceItem}>
                <CheckCircle2 size={15} color="var(--color-sage-green)" />
                <span>100% Free & private</span>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Photographic Frame (Reference Images 1 & 2) */}
          <div style={styles.heroRight}>
            <div style={styles.imageBackingCard} />
            <div style={styles.imageFrame} className="editorial-image-frame">
              <img
                src={SOLAR_IMAGES.heroRooftop}
                alt="Residential rooftop with solar panels in warm morning sunlight surrounded by trees"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_SOLAR_SVG;
                }}
                style={styles.heroImage}
              />
              <div style={styles.imageOverlayBadge}>
                <Leaf size={14} color="#879B7B" />
                <span>A brighter home starts here.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUIET TRUST STRIP */}
      <section style={styles.trustStripSection}>
        <div className="container" style={styles.trustStripGrid}>
          <div style={styles.trustItem}>
            <div style={styles.trustIconWrap}>
              <Home size={18} color="var(--color-forest-green)" />
            </div>
            <div>
              <strong style={styles.trustTitle}>Estimate Rooftop Requirements</strong>
              <p style={styles.trustDesc}>Calculate exact kilowatt sizing and module counts for your space.</p>
            </div>
          </div>

          <div style={styles.trustItem}>
            <div style={styles.trustIconWrap}>
              <Coins size={18} color="var(--color-forest-green)" />
            </div>
            <div>
              <strong style={styles.trustTitle}>Understand Installation Costs</strong>
              <p style={styles.trustDesc}>Transparent gross costs and net expenses after government subsidies.</p>
            </div>
          </div>

          <div style={styles.trustItem}>
            <div style={styles.trustIconWrap}>
              <ShieldCheck size={18} color="var(--color-forest-green)" />
            </div>
            <div>
              <strong style={styles.trustTitle}>Explore Eligible Schemes</strong>
              <p style={styles.trustDesc}>Central PM Surya Ghar guidelines and DISCOM net-metering tips.</p>
            </div>
          </div>

          <div style={styles.trustItem}>
            <div style={styles.trustIconWrap}>
              <TrendingUp size={18} color="var(--color-forest-green)" />
            </div>
            <div>
              <strong style={styles.trustTitle}>Compare Long-Term Savings</strong>
              <p style={styles.trustDesc}>5-year cumulative trajectory and estimated capital payback timelines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTRODUCTORY EDITORIAL SECTION */}
      <section id="benefits-section" style={styles.editorialSection}>
        <div className="container" style={styles.editorialGrid}>
          {/* Left Column: Photograph */}
          <div style={styles.editorialMedia}>
            <div style={styles.editorialImageFrame} className="editorial-image-frame">
              <img
                src={SOLAR_IMAGES.sustainableHome}
                alt="Contemporary architecture with integrated rooftop solar panels and garden foliage"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_SOLAR_SVG;
                }}
                style={styles.editorialImage}
              />
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div style={styles.editorialNarrative}>
            <SectionHeading
              eyebrow="Why Rooftop Solar"
              title="Good for your home. Better for tomorrow."
              subtitle="Electricity tariffs from conventional thermal grids continue to fluctuate. Rooftop solar offers an independent, reliable hedge that transforms unused overhead space into a clean utility generator."
            />

            <div style={styles.factsList}>
              <div style={styles.factItem}>
                <div style={styles.factBullet}>01</div>
                <div>
                  <h4 style={styles.factTitle}>Substantial Grid Offset</h4>
                  <p style={styles.factText}>
                    A properly engineered system can satisfy up to 90% of daytime domestic electricity consumption, reducing monthly power bills immediately upon DISCOM commissioning.
                  </p>
                </div>
              </div>

              <div style={styles.factItem}>
                <div style={styles.factBullet}>02</div>
                <div>
                  <h4 style={styles.factTitle}>Predictable Capital Return</h4>
                  <p style={styles.factText}>
                    With direct central financial assistance under national schemes, residential payback is typically achieved in 3 to 5 years, delivering free generation thereafter for the system’s 25-year service life.
                  </p>
                </div>
              </div>

              <div style={styles.factItem}>
                <div style={styles.factBullet}>03</div>
                <div>
                  <h4 style={styles.factTitle}>Tangible Ecological Footprint</h4>
                  <p style={styles.factText}>
                    Each kilowatt of residential solar offsets over 1.2 tons of grid carbon dioxide emissions annually, replacing coal generation with silent, localized sunshine.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('calculator')}
              className="btn btn-primary"
              style={{ width: 'fit-content', marginTop: '1rem' }}
            >
              <span>See What Your Roof Can Generate</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (Distinctive Horizontal on Desktop) */}
      <section style={styles.howItWorksSection}>
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Simple & Transparent"
            title="How SolarSense AI Works"
            subtitle="We replace opaque contractor estimates with clear mathematical sizing and verified government policy rules."
          />

          <div style={styles.stepsHorizontalGrid}>
            {/* Step 1 */}
            <div className="card" style={styles.stepCard}>
              <div style={styles.stepNumberBadge}>1</div>
              <h3 style={styles.stepTitle}>Tell us about your home</h3>
              <p style={styles.stepDescription}>
                Enter your state, average monthly electricity bill, and approximate shadow-free roof area. No personal contact details required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={styles.stepCard}>
              <div style={styles.stepNumberBadge}>2</div>
              <h3 style={styles.stepTitle}>Get your solar recommendation</h3>
              <p style={styles.stepDescription}>
                Our regional solar irradiation model calculates your optimal system capacity in kW, required panel count, and roof feasibility.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={styles.stepCard}>
              <div style={styles.stepNumberBadge}>3</div>
              <h3 style={styles.stepTitle}>Understand costs, savings & schemes</h3>
              <p style={styles.stepDescription}>
                View net out-of-pocket expenses after central PM Surya Ghar subsidies, projected 5-year savings trajectories, and download a PDF report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION (Deep Evergreen Theme) */}
      <section style={styles.finalCtaSection}>
        <div className="container" style={styles.finalCtaContainer}>
          <div style={styles.ctaCard} className="card-evergreen">
            <span
              className="eyebrow"
              style={{
                backgroundColor: 'rgba(220, 229, 213, 0.15)',
                color: 'var(--color-soft-moss)',
              }}
            >
              Get Started In 2 Minutes
            </span>
            <h2 style={styles.ctaHeadline}>Your rooftop has potential. Let’s find it.</h2>
            <p style={styles.ctaSubtitle}>
              Take control of your home’s energy future today with clean data and verified subsidy calculations.
            </p>

            <button
              onClick={() => navigateTo('calculator')}
              className="btn btn-gold btn-lg"
              style={styles.ctaButton}
            >
              <span>Start My Solar Estimate</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  heroSection: {
    paddingTop: '3.5rem',
    paddingBottom: '4.5rem',
    backgroundColor: 'var(--color-warm-ivory)',
    borderBottom: '1px solid var(--color-soft-sand)',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3.5rem',
    alignItems: 'center',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heroHeadline: {
    color: 'var(--color-deep-evergreen)',
    marginBottom: '1.25rem',
  },
  highlightText: {
    color: 'var(--color-forest-green)',
    fontStyle: 'normal',
  },
  heroSupportText: {
    fontSize: '1.15rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.65',
    marginBottom: '2rem',
    maxWidth: '520px',
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  reassuranceRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.25rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--color-soft-sand)',
  },
  reassuranceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--color-charcoal-subtle)',
  },
  heroRight: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackingCard: {
    position: 'absolute',
    top: '16px',
    right: '-16px',
    bottom: '-16px',
    left: '16px',
    backgroundColor: 'var(--color-soft-sand)',
    borderRadius: 'var(--radius-xl)',
    zIndex: 0,
  },
  imageFrame: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    aspectRatio: '4 / 3.4',
    maxHeight: '480px',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    backgroundColor: 'rgba(23, 56, 43, 0.88)',
    backdropFilter: 'blur(6px)',
    color: '#ffffff',
    padding: '0.55rem 1rem',
    borderRadius: 'var(--radius-pill)',
    fontSize: '0.82rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
  },
  trustStripSection: {
    backgroundColor: 'var(--color-pure-white)',
    borderBottom: '1px solid var(--color-soft-sand)',
    padding: '3rem 0',
  },
  trustStripGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '2rem',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem',
  },
  trustIconWrap: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'var(--color-soft-moss)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  trustTitle: {
    display: 'block',
    fontFamily: 'var(--font-headings)',
    fontSize: '0.92rem',
    color: 'var(--color-deep-evergreen)',
    marginBottom: '0.2rem',
  },
  trustDesc: {
    fontSize: '0.84rem',
    color: 'var(--color-muted-stone)',
    lineHeight: '1.45',
    margin: 0,
  },
  editorialSection: {
    padding: '5rem 0',
    backgroundColor: 'var(--color-warm-ivory)',
  },
  editorialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '4rem',
    alignItems: 'center',
  },
  editorialMedia: {
    position: 'relative',
  },
  editorialImageFrame: {
    width: '100%',
    aspectRatio: '4 / 3.8',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
  },
  editorialImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  editorialNarrative: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  factsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  factItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  factBullet: {
    fontFamily: 'var(--font-headings)',
    fontSize: '0.9rem',
    fontWeight: '800',
    color: 'var(--color-forest-green)',
    backgroundColor: 'var(--color-soft-moss)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  factTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.05rem',
    color: 'var(--color-warm-charcoal)',
    marginBottom: '0.25rem',
  },
  factText: {
    fontSize: '0.92rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.55',
    margin: 0,
  },
  howItWorksSection: {
    padding: '5rem 0',
    backgroundColor: 'var(--color-pure-white)',
    borderTop: '1px solid var(--color-soft-sand)',
    borderBottom: '1px solid var(--color-soft-sand)',
  },
  stepsHorizontalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.75rem',
  },
  stepCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.85rem',
    position: 'relative',
    padding: '2rem 1.75rem',
  },
  stepNumberBadge: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1rem',
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: 'var(--color-forest-green)',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.15rem',
    color: 'var(--color-deep-evergreen)',
    margin: 0,
  },
  stepDescription: {
    fontSize: '0.92rem',
    color: 'var(--color-charcoal-subtle)',
    lineHeight: '1.6',
    margin: 0,
  },
  finalCtaSection: {
    padding: '4.5rem 0',
    backgroundColor: 'var(--color-warm-ivory)',
  },
  finalCtaContainer: {
    maxWidth: '960px',
  },
  ctaCard: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '3.5rem 2rem',
  },
  ctaHeadline: {
    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
    margin: 0,
  },
  ctaSubtitle: {
    fontSize: '1.1rem',
    maxWidth: '560px',
    margin: '0 auto 1.5rem auto',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  ctaButton: {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
  },
};
