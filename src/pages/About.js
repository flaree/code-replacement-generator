import React from 'react';

function About() {
  const aboutStyle = {
    padding: '20px',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: '1.6',
    color: '#333',
  };

  const headingStyle = {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#007BFF',
  };

  const paragraphStyle = {
    marginBottom: '15px',
    color: '#fff',
  };

  const buttonStyle = {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#FF813F', // Buy Me a Coffee orange color
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '16px',
  };

  return (
    <div style={aboutStyle}>
      <h1 style={headingStyle}>About This App</h1>
      <p style={paragraphStyle}>
        This page is a one-stop place to help with the tedious tasks of sports photography, such as generating photomechanic code replacements and team-based metadata generators (still a work in progress).
      </p>
      <p style={paragraphStyle}>
        There's no design polish, just practical tools and simple workflows meant to save you time so you can focus on shooting instead of repetitive tasks.
      </p>
      <p style={paragraphStyle}>
        As information is sourced from transfermarkt website, this means there is no women's data available. I hope to make a women's version in the future.
      </p>
      <p style={paragraphStyle}>
        This site is served free of charge, and without ads however my backend service is paid for by myself. If you find it useful, please consider supporting its development by buying me a coffee.
      </p>

      <a
        href="https://www.buymeacoffee.com/cyqi5my0sl"
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
      >
        Buy Me a Coffee
      </a>
    </div>
  );
}

export default About;