import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faChrome, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import './App.css';
import TeamCodeGenerator from './pages/TeamCodeGenerator';
import LeagueCodeGenerator from './pages/LeagueCodeGenerator';
import ManualClubSearch from './pages/ManualClubSearch';
import About from './pages/About';
import PhotoMetadata from './pages/PhotoMetadata';
import ThemeToggle from './components/ThemeToggle';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * The old labels — Clubs, League, Full League Codes — described the data
 * source. These describe what you get and how you find the teams, which is the
 * only difference that matters when you are choosing between them.
 */
const NAV_ITEMS = [
  { to: '/', label: 'Club search' },
  { to: '/league', label: 'League fixture' },
  { to: '/league-codes', label: 'Full league' },
  { to: '/metadata', label: 'Metadata' },
  { to: '/about', label: 'About' },
];

interface NavLinksProps {
  onNavigate?: () => void;
}

function NavLinks({ onNavigate }: NavLinksProps): React.ReactElement {
  const { pathname } = useLocation();

  return (
    <ul className="app-nav-list">
      {NAV_ITEMS.map(({ to, label }) => {
        const active = pathname === to;
        return (
          <li key={to}>
            <Link
              to={to}
              className={`app-nav-link${active ? ' app-nav-link-active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={onNavigate}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }): React.ReactElement {
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      opener?.focus();
    };
  }, [onClose]);

  return (
    <>
      <div className="mobile-menu-overlay" onClick={onClose} />
      <nav className="mobile-menu" ref={menuRef} aria-label="Main">
        <div className="mobile-menu-head">
          <span className="eyebrow">Menu</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <NavLinks onNavigate={onClose} />
      </nav>
    </>
  );
}

function App(): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ErrorBoundary>
      <Router>
        <div className="app-shell">
          <a className="skip-link" href="#main">
            Skip to content
          </a>

          <header className="app-header">
            <div className="app-header-inner">
              <Link to="/" className="app-brand">
                <span className="app-brand-name">Lensflxre</span>
                <span className="app-brand-tag">Code replacements</span>
              </Link>

              <nav className="app-nav" aria-label="Main">
                <NavLinks />
              </nav>

              <button
                type="button"
                className="mobile-menu-toggle"
                aria-expanded={menuOpen}
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 4.5h14M2 9h14M2 13.5h14" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}

          <main className="app-main" id="main">
            <Routes>
              <Route path="/" element={<ManualClubSearch />} />
              <Route path="/league" element={<TeamCodeGenerator />} />
              <Route path="/league-codes" element={<LeagueCodeGenerator />} />
              <Route path="/metadata" element={<PhotoMetadata />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <div className="app-footer-inner">
              <div className="app-footer-text">
                <div>
                  <strong>Squad data from Transfermarkt.</strong> Check shirt numbers against the
                  team sheet before you file.
                </div>
                <div>© {new Date().getFullYear()} Jamie McGuinness</div>
              </div>
              <div className="app-footer-actions">
                <ThemeToggle />
                <div className="app-social">
                  <a
                    href="https://twitter.com/jxmiemcg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-social-link"
                    aria-label="Twitter"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a
                    href="https://lensflxre.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-social-link"
                    aria-label="Website"
                  >
                    <FontAwesomeIcon icon={faChrome} />
                  </a>
                  <a
                    href="https://instagram.com/lensflxre"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-social-link"
                    aria-label="Instagram"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a
                    href="https://github.com/flaree"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-social-link"
                    aria-label="GitHub"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
