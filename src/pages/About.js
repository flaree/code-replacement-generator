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
        Note that this app is still a work in progress. UI is not my strong suit so please excuse the basic design and the small formatting issues etc.
      </p>
      <p style={paragraphStyle}>
        This app was created to simplify the process of generating photomechanic code replacements for football matches. By selecting teams from various leagues, users can quickly obtain the necessary codes for their workflows.
      </p>
      <p style={paragraphStyle}>It was a quick project with no thought/planning, just the info needed to make generating of the code replacements simple and easy.</p>
      <p style={paragraphStyle}>As information is sourced from transfermarkt website, this means there is no womens data available. I hope to make a womens version in the future.</p>
      <p style={paragraphStyle}>After some requests i've added the below Buy Me a Coffee button, under no way should you feel obliged to do so. I made this project to solve some of the issues I occur while shooting matches and just want to share the tools I create.</p>

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