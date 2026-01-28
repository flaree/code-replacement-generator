import React from 'react';

function About(): React.ReactElement {
  return (
    <div className="container-page">
      <div className="card" style={{ maxWidth: 840, margin: '0 auto' }}>
        <div className="card-header">
          <div>
            <div className="card-title">About these tools</div>
            <div className="card-subtitle">
              A small suite of helpers for sports photographers.
            </div>
          </div>
        </div>
        <div className="stack-md">
          <p className="muted">
            This app brings together a few utilities I use in my own football coverage: generating Photo Mechanic code
            replacements, building team-based metadata, and experimenting with smarter IPTC and XMP workflows.
          </p>
          <p className="muted">
            Data comes from Transfermarkt, which unfortunately means there&apos;s currently no coverage for women&apos;s
            competitions. I&apos;d love to support that in the future as the data becomes available.
          </p>
          <p className="muted">
            Everything here is free and ad‑free, but the backend services are paid for out of pocket. If the tools save
            you time on a matchday or editing session, supporting the project is hugely appreciated.
          </p>
          <div style={{ marginTop: 8 }}>
            <a
              href="https://www.buymeacoffee.com/cyqi5my0sl"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #ff9b3f, #ff6b3f)',
                boxShadow: '0 14px 30px rgba(255, 132, 63, 0.55)',
              }}
            >
              Buy me a coffee
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;