import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import TeamCodeGenerator from './pages/TeamCodeGenerator';
import ManualClubSearch from './pages/ManualClubSearch';
import About from './pages/About';
import PhotoMetadata from './pages/PhotoMetadata';
import ThemeToggle from './components/ThemeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faChrome, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';

function NavLinks() {
  const location = useLocation();
  const current = location.pathname || '/';

  const linkClass = (path) =>
    'app-nav-link' + (current === path ? ' app-nav-link-active' : '');

  return (
    <ul className="app-nav-list">
      <li>
        <Link to="/" className={linkClass('/')}>Clubs</Link>
      </li>
      <li>
        <Link to="/league" className={linkClass('/league')}>League</Link>
      </li>
      <li>
        <Link to="/photo-meta" className={linkClass('/photo-meta')}>Metadata</Link>
      </li>
      <li>
        <Link to="/about" className={linkClass('/about')}>About</Link>
      </li>
    </ul>
  );
}

function App() {
  return (
    <Router>
      <div className="App app-shell">
        <header className="app-header">
          <div className="app-header-inner">
            <div className="app-brand">
              <div className="app-brand-mark" />
              <div className="app-brand-text">
                <div className="app-title">Lensflxre Tools</div>
                <div className="app-subtitle">Sports photography helper suite</div>
              </div>
            </div>
            <nav className="app-nav">
              <NavLinks />
              <div className="app-nav-spacer" />
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="app-main">
          <div className="app-content">
            <Routes>
              <Route path="/" element={<ManualClubSearch />} />
              <Route path="/league" element={<TeamCodeGenerator />} />
              <Route path="/photo-meta" element={<PhotoMetadata />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="app-footer-inner">
            <div className="app-footer-text">
              <div>
                <span className="app-footer-strong">Transfermarkt-sourced data.</span>{' '}
                Information may not be 100% accurate.
              </div>
              <div style={{ marginTop: 4 }}>
                © {new Date().getFullYear()} Jamie McGuinness · All rights reserved.
              </div>
            </div>
            <div className="app-social">
              <a
                href="https://twitter.com/jxmiemcg"
                target="_blank"
                rel="noopener noreferrer"
                className="app-social-link"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href="https://lensflxre.com"
                target="_blank"
                rel="noopener noreferrer"
                className="app-social-link"
              >
                <FontAwesomeIcon icon={faChrome} />
              </a>
              <a
                href="https://instagram.com/lensflxre"
                target="_blank"
                rel="noopener noreferrer"
                className="app-social-link"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://github.com/flaree"
                target="_blank"
                rel="noopener noreferrer"
                className="app-social-link"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
