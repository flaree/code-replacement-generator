import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TeamCodeGenerator from './pages/TeamCodeGenerator';
import ManualClubSearch from './pages/ManualClubSearch';
import About from './pages/About';
import PhotoMetadata from './pages/PhotoMetadata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faChrome, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav style={navStyle}>
            <ul style={navListStyle}>
              <li style={navItemStyle}>
                <Link to="/" style={linkStyle}>Clubs</Link>
              </li>
              <li style={navItemStyle}>
                <Link to="/league" style={linkStyle}>League</Link>
              </li>
              <li style={navItemStyle}>
                <Link to="/photo-meta" style={linkStyle}>Metadata Generator</Link>
              </li>
              <li style={navItemStyle}>
                <Link to="/about" style={linkStyle}>About</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<ManualClubSearch />} />
          <Route path="/league" element={<TeamCodeGenerator />} />
          <Route path="/photo-meta" element={<PhotoMetadata />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <footer style={footerStyle}>
          <p>Note, information is received via transfermarkt website. Information may not be 100% accurate.</p>
          <p>© {new Date().getFullYear()} - Jamie McGuinness. All rights reserved.</p>
          <div style={socialMediaInlineStyle}>
            <a href="https://twitter.com/jxmiemcg" target="_blank" rel="noopener noreferrer" style={iconStyle}>
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://lensflxre.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
              <FontAwesomeIcon icon={faChrome} />
            </a>
            <a href="https://instagram.com/lensflxre" target="_blank" rel="noopener noreferrer" style={iconStyle}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://github.com/flaree" target="_blank" rel="noopener noreferrer" style={iconStyle}>
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

const navStyle = {
  padding: '10px 0',
};

const navListStyle = {
  listStyle: 'none',
  display: 'flex',
  margin: 0,
  padding: 0,
};

const navItemStyle = {
  margin: '0 15px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
  padding: '8px 15px',
  borderRadius: '5px',
  transition: 'background-color 0.3s, transform 0.2s',
};

const footerStyle = {
  textAlign: 'center',
  padding: '10px 0',
  backgroundColor: '#282c34',
  color: 'white',
  marginTop: '20px',
};

const socialMediaInlineStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginTop: '10px',
};

const iconStyle = {
  color: 'white',
  fontSize: '24px',
  textDecoration: 'none',
  transition: 'transform 0.2s',
};

export default App;
