import React, { useState, useEffect } from 'react';
import './codegen.css';

export default function PhotoMetadata() {
  const [meta, setMeta] = useState({
    objectName: '', // Title
    headline: '',
    description: '', // Caption/Description
    byline: '', // Author
    credit: '',
    copyright: '',
    jobId: '',
    keywords: '', // comma separated
    dateCreated: '', // YYYY-MM-DD
    city: '',
    state: '',
    country: '',
    source: '',
  });

  const handleChange = (field) => (e) => setMeta({ ...meta, [field]: e.target.value });

  const asJSON = () => JSON.stringify({ ...meta, keywords: meta.keywords.split(',').map(k => k.trim()).filter(Boolean) }, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asJSON());
      alert('Metadata JSON copied to clipboard');
    } catch (e) {
      alert('Copy failed');
    }
  };

  const escapeXml = (str) => {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const generateXMP = (m) => {
    const keywords = (m.keywords || '')
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const title = escapeXml(m.objectName);
    const headline = escapeXml(m.headline);
    const desc = escapeXml(m.description);
    const byline = escapeXml(m.byline);
    const credit = escapeXml(m.credit);
    // const jobId = escapeXml(m.jobId);
    const copyright = escapeXml(m.copyright);
    const dateCreated = escapeXml(m.dateCreated);
    const city = escapeXml(m.city);
    // const state = escapeXml(m.state);
    const country = escapeXml(m.country);
    const source = escapeXml(m.source);

    const keywordNodes = keywords.map(k => `            <rdf:li>${escapeXml(k)}</rdf:li>`).join('\n');

    // eslint-disable-next-line no-useless-escape
    return `<?xpacket begin=\"\uFEFF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\">\n  <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n           xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n           xmlns:Iptc4xmpCore=\"http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/\">\n    <rdf:Description rdf:about=\"\">\n      <dc:title>\n        <rdf:Alt>\n          <rdf:li xml:lang=\"x-default\">${title}</rdf:li>\n        </rdf:Alt>\n      </dc:title>\n      <dc:creator>\n        <rdf:Seq>\n          <rdf:li>${byline}</rdf:li>\n        </rdf:Seq>\n      </dc:creator>\n      <Iptc4xmpCore:Location>\n        <rdf:Alt>\n          <rdf:li xml:lang=\"x-default\">${city}</rdf:li>\n        </rdf:Alt>\n      </Iptc4xmpCore:Location>\n      <Iptc4xmpCore:CountryCode>${country}</Iptc4xmpCore:CountryCode>\n      <dc:description>\n        <rdf:Alt>\n          <rdf:li xml:lang=\"x-default\">${desc}</rdf:li>\n        </rdf:Alt>\n      </dc:description>\n      <dc:subject>\n        <rdf:Bag>\n${keywordNodes}\n        </rdf:Bag>\n      </dc:subject>\n      <Iptc4xmpCore:DateCreated>${dateCreated}</Iptc4xmpCore:DateCreated>\n      <Iptc4xmpCore:Credit>${credit}</Iptc4xmpCore:Credit>\n      <Iptc4xmpCore:CopyrightNotice>${copyright}</Iptc4xmpCore:CopyrightNotice>\n      <Iptc4xmpCore:Source>${source}</Iptc4xmpCore:Source>\n      <Iptc4xmpCore:Headline>${headline}</Iptc4xmpCore:Headline>\n    </rdf:Description>\n  </rdf:RDF>\n</x:xmpmeta>\n<?xpacket end=\"w\"?>`;
  };

  const handleDownload = () => {
    let xmp = generateXMP(meta);
    const insertionLines = [];
    if (meta.objectName) {
      const ev = escapeXml(meta.objectName);
      insertionLines.push(`      <Iptc4xmpCore:Event>${ev}</Iptc4xmpCore:Event>`);
    }
    if (meta.jobId) {
      const jid = escapeXml(meta.jobId);
      insertionLines.push(`      <Iptc4xmpCore:JobID>${jid}</Iptc4xmpCore:JobID>`);
      insertionLines.push(`      <Iptc4xmpCore:OriginalTransmissionReference>${jid}</Iptc4xmpCore:OriginalTransmissionReference>`);
    }
    if (insertionLines.length > 0) {
      const insert = insertionLines.join('\n') + '\n    </rdf:Description>';
      xmp = xmp.replace('</rdf:Description>', insert);
    }
    const blob = new Blob([xmp], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${meta.objectName || 'photo-metadata'}.xmp`;
    link.click();
  };
  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? 'https://api.lensflxre.com'
      : 'https://api.lensflxre.com';

  // Club search states (hidden behind dropdown)
  const [showClubSearch, setShowClubSearch] = useState(true);
  const [homeSearchTerm, setHomeSearchTerm] = useState('');
  const [awaySearchTerm, setAwaySearchTerm] = useState('');
  const [homeResults, setHomeResults] = useState([]);
  const [awayResults, setAwayResults] = useState([]);
  const [searchingHome, setSearchingHome] = useState(false);
  const [searchingAway, setSearchingAway] = useState(false);
  const [selectedHomeClub, setSelectedHomeClub] = useState(null);
  const [selectedAwayClub, setSelectedAwayClub] = useState(null);
  const [checkToday, setCheckToday] = useState(false);

  const todayISO = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleClubSearch = async (term, setResults, setSearching) => {
    if (!term) return;
    try {
      setSearching(true);
      setResults([]);
      const res = await fetch(`${BASE_URL}/clubs/search/${encodeURIComponent(term)}`);
      const data = await res.json();
      setResults(data.results.map((t) => ({ id: t.id, name: t.name, country: t.country })));
    } catch (e) {
      console.error('Club search failed', e);
      setResults([]);
      alert('Club search failed');
    } finally {
      setSearching(false);
    }
  };

  // Persisted Creator & Rights (byline, credit, copyright, source)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('photo_meta_creator_rights');
      if (saved) {
        const obj = JSON.parse(saved);
        setMeta(prev => ({
          ...prev,
          byline: obj.byline || '',
          credit: obj.credit || '',
          copyright: obj.copyright || '',
          source: obj.source || '',
        }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // keep checkToday in sync with dateCreated
  useEffect(() => {
    const today = todayISO();
    setCheckToday(Boolean(meta.dateCreated && meta.dateCreated === today));
  }, [meta.dateCreated]);

  const saveCreatorRights = () => {
    const payload = {
      byline: meta.byline || '',
      credit: meta.credit || '',
      copyright: meta.copyright || '',
      source: meta.source || '',
    };
    try {
      localStorage.setItem('photo_meta_creator_rights', JSON.stringify(payload));
      alert('Creator & Rights saved');
    } catch (e) {
      alert('Failed to save Creator & Rights');
    }
  };

  const clearSavedCreatorRights = () => {
    try {
      localStorage.removeItem('photo_meta_creator_rights');
    } catch (e) {
      // ignore
    }
    setMeta(prev => ({ ...prev, byline: '', credit: '', copyright: '', source: '' }));
    alert('Saved Creator & Rights cleared');
  };

  const applyClubToMeta = async () => {
    // Build headline/title/description from selected home/away clubs using profile data when available
    if (!selectedHomeClub && !selectedAwayClub) return;

    const fetchProfile = async (club) => {
      if (!club) return null;
      try {
        const res = await fetch(`${BASE_URL}/clubs/${club.id}/profile`);
        return await res.json();
      } catch (e) {
        console.warn('Failed to fetch club profile for', club.name);
        return null;
      }
    };

    const homeProfile = selectedHomeClub ? await fetchProfile(selectedHomeClub) : null;

    const homeName = selectedHomeClub?.name || (homeProfile && homeProfile.name) || '';
    const awayName = selectedAwayClub?.name || '';

    const stadium = (homeProfile && (homeProfile.stadiumName)) || '';
    const country = (homeProfile && (homeProfile.country || homeProfile.location || selectedHomeClub?.country)) || '';

    const title = homeName && awayName ? `${homeName} vs ${awayName}` : (homeName || awayName || 'Match');
    const description = `during the {COMPETITION} game between ${homeName || 'Home'} and ${awayName || 'Away'}${stadium ? ' at ' + stadium : ''}${country ? ', ' + country : ''}`;

    setMeta((prev) => ({
      ...prev,
      objectName: title,
      headline: title,
      description: description,
	  keywords: [prev.keywords, homeName, awayName, stadium, country].filter(Boolean).join(', '),
    }));
  };

  return (
  <div className="generated-code-page container-page">
    <div className="card generated-code-card">
    <div className="card-header">
      <div>
      <div className="card-title">Photo metadata (IPTC/XMP)</div>
      <div className="card-subtitle">
        Build IPTC fields for Photo Mechanic and export as XMP.
      </div>
      </div>
      <span className="pill">Club-aware · Job ID · Fixture today</span>
    </div>

    <div className="stack-md" style={{ marginBottom: 10 }}>
      <p className="muted" style={{ margin: 0 }}>
      Keywords should be comma-separated. Creator & rights can be saved for reuse across sessions.
      </p>
      <div className="generated-inline-row" style={{ justifyContent: 'flex-end' }}>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setShowClubSearch((s) => !s)}
      >
        {showClubSearch ? 'Hide club search' : 'Use club search'}
      </button>
      </div>
    </div>

    {showClubSearch && (
      <div className="generated-grid" style={{ marginBottom: 18 }}>
      <div className="generated-column card" style={{ padding: 14 }}>
        <div className="generated-section-title">Home club</div>
        <label className="field-label">Search</label>
        <div className="generated-inline-row">
        <input
          className="input"
          value={homeSearchTerm}
          onChange={(e) => setHomeSearchTerm(e.target.value)}
          placeholder="e.g. Celtic"
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleClubSearch(homeSearchTerm, setHomeResults, setSearchingHome)}
          disabled={searchingHome}
        >
          {searchingHome ? 'Searching…' : 'Search'}
        </button>
        </div>
        {homeResults.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <label className="field-label">Results</label>
          <select
          className="select"
          value={selectedHomeClub?.id || ''}
          onChange={(e) => {
            const sel = homeResults.find((r) => r.id === e.target.value);
            setSelectedHomeClub(sel || null);
          }}
          >
          <option value="">-- Select home club --</option>
          {homeResults.map((r) => (
            <option key={r.id} value={r.id}>
            {r.name} {r.country ? `- ${r.country}` : ''}
            </option>
          ))}
          </select>
        </div>
        )}
        <div className="btn-row" style={{ marginTop: 10 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={applyClubToMeta}
          disabled={!selectedHomeClub}
        >
          Apply home club
        </button>
        </div>
      </div>

      <div className="generated-column card" style={{ padding: 14 }}>
        <div className="generated-section-title">Away club</div>
        <label className="field-label">Search</label>
        <div className="generated-inline-row">
        <input
          className="input"
          value={awaySearchTerm}
          onChange={(e) => setAwaySearchTerm(e.target.value)}
          placeholder="e.g. Bohemians"
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleClubSearch(awaySearchTerm, setAwayResults, setSearchingAway)}
          disabled={searchingAway}
        >
          {searchingAway ? 'Searching…' : 'Search'}
        </button>
        </div>
        {awayResults.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <label className="field-label">Results</label>
          <select
          className="select"
          value={selectedAwayClub?.id || ''}
          onChange={(e) => {
            const sel = awayResults.find((r) => r.id === e.target.value);
            setSelectedAwayClub(sel || null);
          }}
          >
          <option value="">-- Select away club --</option>
          {awayResults.map((r) => (
            <option key={r.id} value={r.id}>
            {r.name} {r.country ? `- ${r.country}` : ''}
            </option>
          ))}
          </select>
        </div>
        )}
        <div className="btn-row" style={{ marginTop: 10 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={applyClubToMeta}
          disabled={!selectedAwayClub}
        >
          Apply away club
        </button>
        </div>
      </div>
      </div>
    )}

    <div className="grid-2">
      <div className="card" style={{ padding: 14 }}>
      <div className="generated-section-title">Core</div>
      <label className="field-label">Title (Object Name)</label>
      <input className="input" value={meta.objectName} onChange={handleChange('objectName')} />
      <label className="field-label" style={{ marginTop: 10 }}>Headline</label>
      <input className="input" value={meta.headline} onChange={handleChange('headline')} />
      <label className="field-label" style={{ marginTop: 10 }}>Description / Caption</label>
      <textarea
        className="textarea"
        style={{ minHeight: 120, maxHeight: 160 }}
        value={meta.description}
        onChange={handleChange('description')}
      />
      </div>

      <div className="card" style={{ padding: 14 }}>
      <div className="generated-section-title">Creator & rights</div>
      <label className="field-label">Byline (Author)</label>
      <input className="input" value={meta.byline} onChange={handleChange('byline')} />
      <label className="field-label" style={{ marginTop: 10 }}>Credit</label>
      <input className="input" value={meta.credit} onChange={handleChange('credit')} />
      <label className="field-label" style={{ marginTop: 10 }}>Job ID</label>
      <input className="input" value={meta.jobId} onChange={handleChange('jobId')} />
      <label className="field-label" style={{ marginTop: 10 }}>Copyright notice</label>
      <input className="input" value={meta.copyright} onChange={handleChange('copyright')} />
      <label className="field-label" style={{ marginTop: 10 }}>Source</label>
      <input className="input" value={meta.source} onChange={handleChange('source')} />
      <div className="btn-row" style={{ marginTop: 10 }}>
        <button type="button" className="btn btn-secondary" onClick={saveCreatorRights}>
        Save creator/rights
        </button>
        <button type="button" className="btn btn-ghost" onClick={clearSavedCreatorRights}>
        Clear saved
        </button>
      </div>
      </div>
    </div>

    <div className="grid-2" style={{ marginTop: 16 }}>
      <div className="card" style={{ padding: 14 }}>
      <div className="generated-section-title">Location & date</div>
      <label className="field-label">City</label>
      <input className="input" value={meta.city} onChange={handleChange('city')} />
      <label className="field-label" style={{ marginTop: 10 }}>State / Province</label>
      <input className="input" value={meta.state} onChange={handleChange('state')} />
      <label className="field-label" style={{ marginTop: 10 }}>Country</label>
      <input className="input" value={meta.country} onChange={handleChange('country')} />
      <label className="field-label" style={{ marginTop: 10 }}>Date created</label>
      <div className="generated-inline-row">
        <input
        className="input"
        type="date"
        value={meta.dateCreated}
        onChange={(e) => {
          handleChange('dateCreated')(e);
          const val = e.target.value;
          setCheckToday(Boolean(val && val === todayISO()));
        }}
        />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
        <input
          type="checkbox"
          checked={checkToday}
          onChange={(e) => {
          const on = e.target.checked;
          setCheckToday(on);
          if (on) setMeta((prev) => ({ ...prev, dateCreated: todayISO() }));
          else setMeta((prev) => ({ ...prev, dateCreated: '' }));
          }}
        />
        <span>Fixture today</span>
        </label>
      </div>
      </div>
      <div className="card" style={{ padding: 14 }}>
      <div className="generated-section-title">Keywords</div>
      <label className="field-label">Keywords (comma separated)</label>
      <textarea
        className="textarea"
        style={{ minHeight: 170, maxHeight: 210 }}
        value={meta.keywords}
        onChange={handleChange('keywords')}
      />
      </div>
    </div>

    <div className="btn-row">
      <button type="button" className="btn" onClick={handleCopy}>
      Copy JSON
      </button>
      <button
      type="button"
      className="btn btn-secondary"
      onClick={() => {
        let xmpToCopy = generateXMP(meta);
        const insertionLines = [];
        if (meta.objectName) {
        const ev = escapeXml(meta.objectName);
        insertionLines.push(`      <Iptc4xmpCore:Event>${ev}</Iptc4xmpCore:Event>`);
        }
        if (meta.jobId) {
        const jid = escapeXml(meta.jobId);
        insertionLines.push(`      <Iptc4xmpCore:JobID>${jid}</Iptc4xmpCore:JobID>`);
        insertionLines.push(`      <Iptc4xmpCore:OriginalTransmissionReference>${jid}</Iptc4xmpCore:OriginalTransmissionReference>`);
        }
        if (insertionLines.length > 0) {
        const insert = insertionLines.join('\n') + '\n    </rdf:Description>';
        xmpToCopy = xmpToCopy.replace('</rdf:Description>', insert);
        }
        navigator.clipboard && navigator.clipboard.writeText(xmpToCopy);
        alert('XMP copied to clipboard');
      }}
      >
      Copy XMP
      </button>
      <button type="button" className="btn" onClick={handleDownload}>
      Download XMP
      </button>
      <button
      type="button"
      className="btn btn-ghost"
      onClick={() => {
        setMeta({
        objectName: '',
        headline: '',
        description: '',
        byline: '',
        credit: '',
        copyright: '',
        jobId: '',
        keywords: '',
        dateCreated: '',
        city: '',
        state: '',
        country: '',
        source: '',
        });
      }}
      >
      Clear
      </button>
    </div>

    <div className="preview-block">
      <div className="preview-heading">
      <span>Preview (JSON)</span>
      </div>
      <pre className="preview-body">{asJSON()}</pre>
    </div>
    </div>
  </div>
  );
}
