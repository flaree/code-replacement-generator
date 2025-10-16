import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TeamCodeGenerator from './pages/TeamCodeGenerator';
import ManualClubSearch from './pages/ManualClubSearch';
import About from './pages/About';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav style={navStyle}>
            <ul style={navListStyle}>
              <li style={navItemStyle}>
                <Link to="/" style={linkStyle}>League Game</Link>
              </li>
              <li style={navItemStyle}>
                <Link to="/manual" style={linkStyle}>Manual Search</Link>
              </li>
              <li style={navItemStyle}>
                <Link to="/about" style={linkStyle}>About</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<TeamCodeGenerator />} />
          <Route path="/manual" element={<ManualClubSearch />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <footer style={footerStyle}>
          <p>Note, information is received via transfermarkt website. Information may not be 100% accurate.</p>
          <p>© 2025 Jamie McGuinness. All rights reserved.</p>
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

export default App;
