import React from 'react';

function About(): React.ReactElement {
  return (
    <div className="container-page">
      <section className="panel">
        <div className="panel-head">
          <h1 className="panel-title">About these tools</h1>
          <span className="eyebrow">Built on a touchline</span>
        </div>

        <div className="panel-body stack">
          <p className="muted">
            A few utilities from my own football coverage: Photo Mechanic code replacements,
            team-based metadata, and some experiments with IPTC and XMP workflows.
          </p>

          <p className="muted">
            Squad data comes from Transfermarkt, which means there is no coverage of women&rsquo;s
            competitions yet. I&rsquo;d like to add it as the data becomes available.
          </p>

          <div>
            <h2 className="field-label" style={{ marginBottom: 6 }}>
              Where the data came from
            </h2>
            <p className="muted">
              Transfermarkt limits how often it can be scraped, so squad and club data is cached
              on the server. A badge on each tool says which you got:{' '}
              <span className="tag tag-ok">Live</span> was fetched just now,{' '}
              <span className="tag">Cached</span> was reused and shows its age, and{' '}
              <span className="tag tag-signal">Stale</span> means Transfermarkt blocked the request
              and older data was used instead. On Stale, check shirt numbers against the team sheet
              before you rely on the codes.
            </p>
          </div>

          <p className="muted">
            Everything here is free and ad-free, and the backend is paid for out of pocket. If it
            saves you time on a matchday, a coffee is very welcome.
          </p>

          <div>
            <a
              href="https://www.buymeacoffee.com/cyqi5my0sl"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ background: '#ff813f', color: '#1a1b1e' }}
            >
              Buy me a coffee
            </a>
          </div>
        </div>

        <div className="panel-foot" style={{ display: 'block' }}>
          <h2 className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
            Contact
          </h2>
          <div className="stack-sm">
            <div>
              <span className="muted" style={{ display: 'inline-block', minWidth: 84 }}>
                Instagram
              </span>
              <a href="https://instagram.com/lensflxre" target="_blank" rel="noopener noreferrer">
                @lensflxre
              </a>
            </div>
            <div>
              <span className="muted" style={{ display: 'inline-block', minWidth: 84 }}>
                Email
              </span>
              <a href="mailto:jamie@jamiemcg.ie">jamie@jamiemcg.ie</a>
              <span className="muted"> or </span>
              <a href="mailto:jamie@lensflxre.com">jamie@lensflxre.com</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
