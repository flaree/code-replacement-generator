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

  const styles = {
    container: { padding: '20px', maxWidth: '900px', margin: '0 auto' },
    groups: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '12px' },
    groupBox: { border: '1px solid #ddd', borderRadius: '8px', padding: '12px', background: '#fafafa' },
    groupTitle: { margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#333' },
    label: { display: 'block', fontSize: '13px', color: '#222', marginBottom: '6px' },
    input: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' },
    buttons: { marginTop: '16px', display: 'flex', gap: '8px' },
    preview: { background: '#fff', padding: '12px', border: '1px solid #eee', borderRadius: '6px', marginTop: '16px', fontSize: '13px' },
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
    <div className="codegen-container" style={styles.container}>
      <h1>Photo Metadata (IPTC - common fields) - Under Development</h1>
      <p>Fill in commonly used IPTC fields for Photo Mechanic/ingest. Keywords should be comma-separated.</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
        <div />
        <button onClick={() => setShowClubSearch(s => !s)} style={{ padding: '8px 12px' }}>{showClubSearch ? 'Hide Club Search' : 'Use Club Search'}</button>
      </div>

      {showClubSearch && (
        <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={styles.groupBox}>
            <div style={styles.groupTitle}>Home Club Search</div>
            <label style={styles.label}>Search
              <div style={{ display: 'flex', gap: '8px' }}>
                <input style={styles.input} value={homeSearchTerm} onChange={(e) => setHomeSearchTerm(e.target.value)} placeholder="e.g. Celtic" />
                <button onClick={() => handleClubSearch(homeSearchTerm, setHomeResults, setSearchingHome)} disabled={searchingHome} style={{ padding: '8px 10px' }}>{searchingHome ? 'Searching...' : 'Search'}</button>
              </div>
            </label>
            {homeResults.length > 0 && (
              <label style={styles.label}>Results
                <select style={styles.input} value={selectedHomeClub?.id || ''} onChange={(e) => {
                  const sel = homeResults.find(r => r.id === e.target.value);
                  setSelectedHomeClub(sel || null);
                }}>
                  <option value="">-- Select Home Club --</option>
                  {homeResults.map(r => <option key={r.id} value={r.id}>{r.name} {r.country ? `- ${r.country}` : ''}</option>)}
                </select>
              </label>
            )}
            <div style={{ marginTop: '8px' }}>
              <button onClick={() => { applyClubToMeta(); }} style={{ padding: '8px 12px' }} disabled={!selectedHomeClub}>Apply Home Club</button>
            </div>
          </div>

          <div style={styles.groupBox}>
            <div style={styles.groupTitle}>Away Club Search</div>
            <label style={styles.label}>Search
              <div style={{ display: 'flex', gap: '8px' }}>
                <input style={styles.input} value={awaySearchTerm} onChange={(e) => setAwaySearchTerm(e.target.value)} placeholder="e.g. Bohemians" />
                <button onClick={() => handleClubSearch(awaySearchTerm, setAwayResults, setSearchingAway)} disabled={searchingAway} style={{ padding: '8px 10px' }}>{searchingAway ? 'Searching...' : 'Search'}</button>
              </div>
            </label>
            {awayResults.length > 0 && (
              <label style={styles.label}>Results
                <select style={styles.input} value={selectedAwayClub?.id || ''} onChange={(e) => {
                  const sel = awayResults.find(r => r.id === e.target.value);
                  setSelectedAwayClub(sel || null);
                }}>
                  <option value="">-- Select Away Club --</option>
                  {awayResults.map(r => <option key={r.id} value={r.id}>{r.name} {r.country ? `- ${r.country}` : ''}</option>)}
                </select>
              </label>
            )}
            <div style={{ marginTop: '8px' }}>
              <button onClick={() => { applyClubToMeta(); }} style={{ padding: '8px 12px' }} disabled={!selectedAwayClub}>Apply Away Club</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.groups}>
        <div style={styles.groupBox}>
          <div style={styles.groupTitle}>Core</div>
          <label style={styles.label}>Title (Object Name)
            <input style={styles.input} value={meta.objectName} onChange={handleChange('objectName')} />
          </label>
          <label style={styles.label}>Headline
            <input style={styles.input} value={meta.headline} onChange={handleChange('headline')} />
          </label>
          <label style={styles.label}>Description / Caption
            <textarea style={{ ...styles.textarea, minHeight: '120px', maxHeight:'140px', resize: 'vertical' }}  value={meta.description} onChange={handleChange('description')}/>
          </label>
        </div>

        <div style={styles.groupBox}>
          <div style={styles.groupTitle}>Creator & Rights</div>
          <label style={styles.label}>Byline (Author)
            <input style={styles.input} value={meta.byline} onChange={handleChange('byline')} />
          </label>
          <label style={styles.label}>Credit
            <input style={styles.input} value={meta.credit} onChange={handleChange('credit')} />
          </label>
          <label style={styles.label}>Job ID
            <input style={styles.input} value={meta.jobId} onChange={handleChange('jobId')} />
          </label>
          <label style={styles.label}>Copyright Notice
            <input style={styles.input} value={meta.copyright} onChange={handleChange('copyright')} />
          </label>
          <label style={styles.label}>Source
            <input style={styles.input} value={meta.source} onChange={handleChange('source')} />
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button onClick={saveCreatorRights} style={{ padding: '8px 12px' }}>Save Creator/Rights</button>
            <button onClick={clearSavedCreatorRights} style={{ padding: '8px 12px' }}>Clear Saved</button>
          </div>
        </div>

        <div style={styles.groupBox}>
          <div style={styles.groupTitle}>Location & Date</div>
          <label style={styles.label}>City
            <input style={styles.input} value={meta.city} onChange={handleChange('city')} />
          </label>
          <label style={styles.label}>State / Province
            <input style={styles.input} value={meta.state} onChange={handleChange('state')} />
          </label>
          <label style={styles.label}>Country
            <input style={styles.input} value={meta.country} onChange={handleChange('country')} />
          </label>
          <label style={styles.label}>Date Created
            <input style={styles.input} type="date" value={meta.dateCreated} onChange={handleChange('dateCreated')} />
          </label>
        </div>

        <div style={styles.groupBox}>
          <div style={styles.groupTitle}>Keywords</div>
          <label style={styles.label}>Keywords (comma separated)
            <textarea style={{ ...styles.textarea, minHeight: '180px', maxHeight:'200px', resize: 'vertical' }} value={meta.keywords} onChange={handleChange('keywords')} />
          </label>
        </div>
      </div>

      <div style={styles.buttons}>
        <button onClick={handleCopy} style={{ padding: '8px 12px' }}>Copy JSON</button>
        <button onClick={() => {
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
        }} style={{ padding: '8px 12px' }}>Copy XMP</button>
        <button onClick={handleDownload} style={{ padding: '8px 12px' }}>Download XMP</button>
        <button onClick={() => { setMeta({ objectName: '', headline: '', description: '', byline: '', credit: '', copyright: '', jobId: '', keywords: '', dateCreated: '', city: '', state: '', country: '', source: '' }); }} style={{ padding: '8px 12px' }}>Clear</button>
      </div>

      <h3 style={{ marginTop: '18px' }}>Preview (JSON)</h3>
      <pre style={{ ...styles.preview, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{asJSON()}</pre>
    </div>
  );
}
