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

  return (
    <div style={aboutStyle}>
      <h1 style={headingStyle}>About This App</h1>
      <p style={paragraphStyle}>
        This app was created to simplify the process of generating photomechanic code replacements for football matches. By selecting teams from various leagues, users can quickly obtain the necessary codes for their workflows.
      </p>
      <p style={paragraphStyle}>It was a quick project with no thought/planning, just the info needed to make generating of the code replacements simple and easy.</p>
	  <p style={paragraphStyle}>As information is sourced from transfermarkt website, this means there is no womens data available. I hope to make a womens version in the future.</p>
      
    </div>
  );
}

export default About;