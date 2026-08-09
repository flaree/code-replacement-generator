// @ts-nocheck - the IPTC reader and XMP writer below work in raw bytes and template
// strings; typing them properly is a separate job from the interface around them.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './codegen.css';
import CacheStatusBadge from '../components/CacheStatusBadge';
import CopyButton from '../components/CopyButton';
import ClubField from '../components/ClubField';
import { escapeXml, copyToClipboard, downloadTextFile, getTodayISO } from '../utils/helpers';
import { fetchClubProfile } from '../services/api';

const COMMON_COMPETITIONS = [
  'LOI Premier Division', 'LOI First Division', 'Scottish Premiership', 'Scottish Championship', 'Scottish Cup', 'League Cup',
  'Premier League', 'Championship', 'FA Cup', 'Carabao Cup',
  'UEFA Champions League', 'UEFA Europa League', 'UEFA Conference League',
  'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'Eredivisie',
  'World Cup', 'European Championship',
];

const EMPTY_META = {
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
  stadium: '',
};

function readIptcTags(data) {
  const fields = {};
  const decoder = new TextDecoder('utf-8');
  let i = 0;
  while (i < data.length - 4) {
    if (data[i] !== 0x1C) { i++; continue; }
    const record = data[i + 1];
    const tag    = data[i + 2];
    const size   = (data[i + 3] << 8) | data[i + 4];
    i += 5;
    if (record === 2) {
      const val = decoder.decode(data.slice(i, i + size));
      switch (tag) {
        case 5:   fields.objectName  = val; break;
        case 25:  fields.keywords    = fields.keywords ? fields.keywords + ', ' + val : val; break;
        case 55:  fields.dateCreated = val.length === 8 ? `${val.slice(0,4)}-${val.slice(4,6)}-${val.slice(6,8)}` : val; break;
        case 80:  fields.byline      = val; break;
        case 90:  fields.city        = val; break;
        case 92:  if (!fields.state) { fields.state = val; } break;
        case 95:  fields.state       = fields.state || val; break;
        case 101: fields.country     = val; break;
        case 103: fields.jobId       = val; break;
        case 105: fields.headline    = val; break;
        case 110: fields.credit      = val; break;
        case 115: fields.source      = val; break;
        case 116: fields.copyright   = val; break;
        case 120: fields.description = val; break;
        default: break;
      }
    }
    i += size;
  }
  return fields;
}

function parseIptcFromJpeg(buffer) {
  const data = new Uint8Array(buffer);
  const view = new DataView(buffer);
  if (view.getUint16(0) !== 0xFFD8) { return null; }
  let offset = 2;
  while (offset < data.length - 1) {
    if (data[offset] !== 0xFF) { break; }
    const marker = data[offset + 1];
    if (marker === 0xD8 || marker === 0xD9) { offset += 2; continue; }
    if (marker === 0xFF) { offset++; continue; }
    const segLen = view.getUint16(offset + 2);
    if (marker === 0xED) {
      let pos = offset + 4;
      const end = offset + 2 + segLen;
      const hdr = String.fromCharCode(...data.slice(pos, pos + 13));
      if (hdr === 'Photoshop 3.0') {
        pos += 14;
        while (pos < end - 7) {
          const bim = String.fromCharCode(data[pos], data[pos+1], data[pos+2], data[pos+3]);
          if (bim !== '8BIM') { break; }
          pos += 4;
          const resType = (data[pos] << 8) | data[pos + 1];
          pos += 2;
          const nameLen = data[pos];
          pos += (nameLen % 2 === 0 ? nameLen + 2 : nameLen + 1);
          const resLen = view.getUint32(pos); pos += 4;
          if (resType === 0x0404) { return readIptcTags(data.slice(pos, pos + resLen)); }
          pos += resLen + (resLen % 2);
        }
      }
    }
    offset += 2 + segLen;
  }
  return null;
}

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
  const jobId = escapeXml(m.jobId);
  const copyright = escapeXml(m.copyright);
  const dateCreated = escapeXml(m.dateCreated);
  const city = escapeXml(m.city);
  const state = escapeXml(m.state);
  const country = escapeXml(m.country);
  const source = escapeXml(m.source);
  const stadium = escapeXml(m.stadium);
  const event = headline || title;

  const keywordNodes = keywords.map(k => `            <rdf:li>${escapeXml(k)}</rdf:li>`).join('\n');

  // eslint-disable-next-line no-useless-escape
  return `<?xpacket begin=\"\uFEFF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\">\n  <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n           xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n           xmlns:photoshop=\"http://ns.adobe.com/photoshop/1.0/\"\n           xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\"\n           xmlns:Iptc4xmpCore=\"http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/\"\n           xmlns:Iptc4xmpExt=\"http://iptc.org/std/Iptc4xmpExt/2008-02-29/\">\n    <rdf:Description rdf:about=\"\"\n     Iptc4xmpCore:Location=\"${stadium}\">\n      <dc:title>\n        <rdf:Alt>\n          <rdf:li xml:lang=\"x-default\">${title}</rdf:li>\n        </rdf:Alt>\n      </dc:title>\n      <dc:creator>\n        <rdf:Seq>\n          <rdf:li>${byline}</rdf:li>\n        </rdf:Seq>\n      </dc:creator>\n      <dc:rights>\n        <rdf:Alt>\n          <rdf:li xml:lang=\"x-default\">${copyright}</rdf:li>\n        </rdf:Alt>\n      </dc:rights>\n      <photoshop:City>${city}</photoshop:City>\n      <photoshop:State>${state}</photoshop:State>\n      <photoshop:Country>${country}</photoshop:Country>\n      <photoshop:Credit>${credit}</photoshop:Credit>\n      <photoshop:Source>${source}</photoshop:Source>\n      <photoshop:DateCreated>${dateCreated}</photoshop:DateCreated>\n      <photoshop:Headline>${headline}</photoshop:Headline>\n      <photoshop:TransmissionReference>${jobId}</photoshop:TransmissionReference>\n      <dc:description>\n        <rdf:Alt>\n          <rdf:li xml:lang=\"x-default\">${desc}</rdf:li>\n        </rdf:Alt>\n      </dc:description>\n      <dc:subject>\n        <rdf:Bag>\n${keywordNodes}\n        </rdf:Bag>\n      </dc:subject>\n      <Iptc4xmpCore:DateCreated>${dateCreated}</Iptc4xmpCore:DateCreated>\n      <Iptc4xmpCore:Credit>${credit}</Iptc4xmpCore:Credit>\n      <Iptc4xmpCore:CopyrightNotice>${copyright}</Iptc4xmpCore:CopyrightNotice>\n      <Iptc4xmpCore:Source>${source}</Iptc4xmpCore:Source>\n      <Iptc4xmpCore:Headline>${headline}</Iptc4xmpCore:Headline>\n      <Iptc4xmpCore:JobID>${jobId}</Iptc4xmpCore:JobID>\n      <Iptc4xmpCore:OriginalTransmissionReference>${jobId}</Iptc4xmpCore:OriginalTransmissionReference>\n      <Iptc4xmpExt:Event>\n        <rdf:Alt>\n          <rdf:li xml:lang=\"x-default\">${event}</rdf:li>\n        </rdf:Alt>\n      </Iptc4xmpExt:Event>\n    </rdf:Description>\n  </rdf:RDF>\n</x:xmpmeta>\n<?xpacket end=\"w\"?>`;
};

/**
 * Build the IPTC fields for a fixture and export them as an XMP sidecar.
 *
 * Choosing the two clubs writes the title, headline, caption and keywords for
 * you; everything stays editable afterwards. The pane on the right is the XMP
 * that will be written, not a summary of it.
 */
export default function PhotoMetadata() {
  const [searchParams] = useSearchParams();
  const [meta, setMeta] = useState(EMPTY_META);
  const [competition, setCompetition] = useState('');
  const [home, setHome] = useState(null);
  const [away, setAway] = useState(null);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templates, setTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('photo_meta_templates') || '[]'); }
    catch { return []; }
  });

  const [fixtureFacts, setFixtureFacts] = useState({ stadium: '', country: '' });

  const jpegInputRef = useRef(null);
  const competitionRef = useRef('');
  const prevCompetitionRef = useRef('');
  /** Exactly the keywords this page added, so it can take them back out. */
  const autoKeywordsRef = useRef([]);

  const handleChange = (field) => (e) => setMeta({ ...meta, [field]: e.target.value });

  const asJSON = () =>
    JSON.stringify(
      { ...meta, keywords: meta.keywords.split(',').map((k) => k.trim()).filter(Boolean) },
      null,
      2
    );

  const xmp = generateXMP(meta);

  // Arriving from a code-replacement page carries the fixture with it.
  useEffect(() => {
    const homeId = searchParams.get('homeId');
    const homeName = searchParams.get('homeName');
    const awayId = searchParams.get('awayId');
    const awayName = searchParams.get('awayName');

    if (homeId && homeName) {
      setHome({ id: homeId, name: homeName, country: searchParams.get('homeCountry') || '' });
    }
    if (awayId && awayName) {
      setAway({ id: awayId, name: awayName, country: searchParams.get('awayCountry') || '' });
    }
  }, [searchParams]);

  // Creator and rights rarely change between jobs, so they persist.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('photo_meta_creator_rights');
      if (saved) {
        const obj = JSON.parse(saved);
        setMeta((prev) => ({
          ...prev,
          byline: obj.byline || '',
          credit: obj.credit || '',
          copyright: obj.copyright || '',
          source: obj.source || '',
        }));
      }
    } catch (e) {
      // Nothing saved, or a corrupt entry: start from the defaults.
    }
  }, []);

  const saveCreatorRights = () => {
    try {
      localStorage.setItem(
        'photo_meta_creator_rights',
        JSON.stringify({
          byline: meta.byline || '',
          credit: meta.credit || '',
          copyright: meta.copyright || '',
          source: meta.source || '',
        })
      );
      toast.success('Saved. These load with every new job.');
    } catch (e) {
      toast.error('Your browser blocked local storage, so nothing was saved.');
    }
  };

  const clearSavedCreatorRights = () => {
    try { localStorage.removeItem('photo_meta_creator_rights'); } catch (e) { /* ignore */ }
    setMeta((prev) => ({ ...prev, byline: '', credit: '', copyright: '', source: '' }));
    toast.success('Cleared.');
  };

  const applyTemplate = (t) => {
    if (t.competition) { setCompetition(t.competition); }
    setMeta((prev) => ({
      ...prev,
      ...(t.byline && { byline: t.byline }),
      ...(t.credit && { credit: t.credit }),
      ...(t.copyright && { copyright: t.copyright }),
      ...(t.source && { source: t.source }),
    }));
    toast.success(`Applied ${t.name}.`);
  };

  const deleteTemplate = (index) => {
    const updated = templates.filter((_, i) => i !== index);
    setTemplates(updated);
    try { localStorage.setItem('photo_meta_templates', JSON.stringify(updated)); } catch (e) { /* ignore */ }
    toast.success('Template deleted.');
  };

  const saveTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Give the template a name first.');
      return;
    }
    const t = {
      name: templateName.trim(),
      competition,
      byline: meta.byline,
      credit: meta.credit,
      copyright: meta.copyright,
      source: meta.source,
    };
    const updated = [...templates.filter((x) => x.name !== t.name), t];
    setTemplates(updated);
    try { localStorage.setItem('photo_meta_templates', JSON.stringify(updated)); } catch (e) { /* ignore */ }
    setTemplateName('');
    toast.success(`Saved ${t.name}.`);
  };

  const handleJpegImport = (file) => {
    if (!file) { return; }
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      toast.error('That is not a JPEG. IPTC can only be read from JPEG files.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseIptcFromJpeg(ev.target.result);
      if (!parsed || Object.keys(parsed).length === 0) {
        toast.error('No IPTC fields in that file. Nothing was changed.');
        return;
      }
      setMeta((prev) => ({ ...prev, ...parsed }));
      toast.success(`Read ${Object.keys(parsed).length} fields from the JPEG.`);
    };
    reader.readAsArrayBuffer(file);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) { return ''; }
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const applyClubToMeta = useCallback(async () => {
    if (!home && !away) { return; }

    const homeProfile = home ? await fetchClubProfile(home.id).catch(() => null) : null;

    const homeName = home?.name || homeProfile?.name || '';
    const awayName = away?.name || '';
    const stadium = homeProfile?.stadiumName || '';
    const country = home?.country || homeProfile?.country || '';

    const title = homeName && awayName ? `${homeName} vs ${awayName}` : (homeName || awayName || 'Match');
    const description = `during the ${competitionRef.current || '{COMPETITION}'} match between ${homeName || 'Home Team'} and ${awayName || 'Away Team'}${stadium ? ' at ' + stadium : ''}.`;

    setMeta((prev) => {
      const dateSuffix = prev.dateCreated ? ` (${formatDisplayDate(prev.dateCreated)})` : '';
      return {
        ...prev,
        objectName: title + dateSuffix,
        headline: `${homeName || 'Home Team'} -v- ${awayName || 'Away Team'}${dateSuffix}`,
        description,
        country: country || prev.country,
        stadium: stadium || prev.stadium,
      };
    });

    // Keywords are owned by the effect below, not written here. This call is
    // async, so writing them from here deposited whatever the competition
    // happened to say while the profile request was in flight.
    setFixtureFacts({ stadium, country });
  }, [home, away]);

  useEffect(() => {
    if (home || away) {
      applyClubToMeta();
      return;
    }
    // With no clubs there is no fixture to take the stadium and country from,
    // so they stop counting as keywords this page contributed.
    setFixtureFacts({ stadium: '', country: '' });
  }, [home, away, applyClubToMeta]);

  // The date is part of the title and headline, so changing it rewrites both.
  useEffect(() => {
    if ((home || away) && meta.dateCreated) {
      const homeName = home?.name || '';
      const awayName = away?.name || '';
      setMeta((prev) => {
        const dateSuffix = prev.dateCreated ? ` (${formatDisplayDate(prev.dateCreated)})` : '';
        const baseTitle = homeName && awayName ? `${homeName} vs ${awayName}` : (homeName || awayName || 'Match');
        return {
          ...prev,
          objectName: baseTitle + dateSuffix,
          headline: `${homeName || 'Home Team'} -v- ${awayName || 'Away Team'}${dateSuffix}`,
        };
      });
    }
  }, [meta.dateCreated, home, away]);

  useEffect(() => { competitionRef.current = competition; }, [competition]);

  // Swapping competition rewrites it in the caption, where it appears once.
  useEffect(() => {
    const previous = prevCompetitionRef.current;
    prevCompetitionRef.current = competition;
    setMeta((m) => {
      const toReplace = previous || '{COMPETITION}';
      if (!toReplace || !m.description.includes(toReplace)) {
        return m;
      }
      return {
        ...m,
        description: m.description.replace(toReplace, competition || '{COMPETITION}'),
      };
    });
  }, [competition]);

  /**
   * Keep the keywords the app contributes in step with the fixture.
   *
   * Everything the app adds is remembered, so the next pass can take exactly
   * those back out before adding the current set. Anything you typed yourself
   * was never in that set and is left alone. Diffing against a single
   * remembered value instead used to strand a keyword for every intermediate
   * competition — typing "test league one two" left "test", "test league" and
   * "test league one" behind.
   */
  useEffect(() => {
    const additions = [
      home?.name,
      away?.name,
      fixtureFacts.stadium,
      fixtureFacts.country,
      competition,
    ]
      .map((value) => (value ?? '').trim())
      .filter(Boolean);

    const previousAuto = autoKeywordsRef.current;
    autoKeywordsRef.current = additions;

    setMeta((m) => {
      const kept = (m.keywords ? m.keywords.split(',') : [])
        .map((k) => k.trim())
        .filter(Boolean)
        .filter((k) => !previousAuto.some((a) => a.toLowerCase() === k.toLowerCase()));

      const next = [...kept];
      additions.forEach((kw) => {
        if (!next.some((k) => k.toLowerCase() === kw.toLowerCase())) {
          next.push(kw);
        }
      });

      const joined = next.join(', ');
      return joined === m.keywords ? m : { ...m, keywords: joined };
    });
  }, [home, away, competition, fixtureFacts]);

  const keywordCount = meta.keywords.split(',').map((k) => k.trim()).filter(Boolean).length;
  const filename = `${meta.dateCreated ? meta.dateCreated + '-' : ''}${meta.objectName || 'metadata'}`;

  return (
    <div className="workspace">
      <Toaster position="top-right" />

      <div className="workspace-setup">
        <section className="panel">
          <div className="panel-head">
            <h1 className="panel-title">Fixture</h1>
            <CacheStatusBadge />
          </div>

          <div className="panel-body stack">
            <div>
              <label className="field-label" htmlFor="pm-competition">Competition</label>
              <input
                id="pm-competition"
                className="input"
                list="competition-list"
                value={competition}
                placeholder="e.g. Scottish Premiership"
                onChange={(e) => setCompetition(e.target.value)}
              />
              <datalist id="competition-list">
                {COMMON_COMPETITIONS.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            <ClubField
              label="Home club"
              placeholder="e.g. Celtic"
              club={home}
              onSelect={setHome}
              onClear={() => setHome(null)}
            />
            <ClubField
              label="Away club"
              placeholder="e.g. Bohemians"
              club={away}
              onSelect={setAway}
              onClear={() => setAway(null)}
            />

            <div>
              <label className="field-label" htmlFor="pm-date">Date of the fixture</label>
              <div className="field-row">
                <input
                  id="pm-date"
                  className="input"
                  type="date"
                  value={meta.dateCreated}
                  onChange={handleChange('dateCreated')}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={meta.dateCreated === getTodayISO()}
                  onClick={() => setMeta((prev) => ({ ...prev, dateCreated: getTodayISO() }))}
                >
                  Today
                </button>
              </div>
              <p className="field-hint">Written into the title, the headline and the file name.</p>
            </div>
          </div>

          <div className="panel-foot">
            <input
              ref={jpegInputRef}
              type="file"
              accept="image/jpeg"
              aria-label="Choose a JPEG to read IPTC from"
              style={{ display: 'none' }}
              onChange={(e) => { handleJpegImport(e.target.files?.[0]); e.target.value = ''; }}
            />
            <button type="button" className="btn btn-secondary" onClick={() => jpegInputRef.current?.click()}>
              Read fields from a JPEG
            </button>
          </div>
        </section>

        <div className={`disclosure ${templatesOpen ? 'disclosure-open' : ''}`}>
          <button
            type="button"
            className="disclosure-summary"
            aria-expanded={templatesOpen}
            onClick={() => setTemplatesOpen(!templatesOpen)}
          >
            <span className="disclosure-chevron" aria-hidden="true" />
            <span className="disclosure-summary-label">
              Templates
              <span className="field-hint">
                {templates.length ? `${templates.length} saved` : 'None saved yet'}
              </span>
            </span>
          </button>

          {templatesOpen && (
            <div className="disclosure-panel stack">
              {templates.length === 0 ? (
                <p className="field-hint" style={{ marginTop: 0 }}>
                  A template stores the competition plus your creator and rights fields. Fill those
                  in, then save one here.
                </p>
              ) : (
                <div className="stack-sm">
                  {templates.map((t, index) => (
                    <div key={t.name} className="template-row">
                      <span className="template-name">
                        {t.name}
                        {t.competition && <span className="muted"> · {t.competition}</span>}
                      </span>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => applyTemplate(t)}>
                        Apply
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteTemplate(index)}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="field-label" htmlFor="pm-template-name">Save what is on screen</label>
                <div className="field-row">
                  <input
                    id="pm-template-name"
                    className="input"
                    value={templateName}
                    placeholder="e.g. Scottish Premiership"
                    onChange={(e) => setTemplateName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveTemplate()}
                  />
                  <button type="button" className="btn btn-secondary" onClick={saveTemplate}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="stack">
        <section className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Photo metadata</h2>
            <span className="eyebrow">IPTC fields</span>
          </div>

          <div className="panel-body stack">
            <div>
              <span className="eyebrow">Caption</span>
              <div className="stack-sm" style={{ marginTop: 8 }}>
                <div className="grid-2">
                  <div>
                    <label className="field-label" htmlFor="pm-title">Title</label>
                    <input id="pm-title" className="input" value={meta.objectName} onChange={handleChange('objectName')} placeholder="Celtic vs Bohemians" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="pm-headline">Headline</label>
                    <input id="pm-headline" className="input" value={meta.headline} onChange={handleChange('headline')} placeholder="Celtic -v- Bohemians" />
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="pm-desc">Caption</label>
                  <textarea id="pm-desc" className="textarea" value={meta.description} onChange={handleChange('description')} placeholder="during the … match between … and … at …" />
                </div>
              </div>
            </div>

            <div>
              <span className="eyebrow">Creator and rights</span>
              <div className="grid-2" style={{ marginTop: 8 }}>
                <div>
                  <label className="field-label" htmlFor="pm-byline">Byline</label>
                  <input id="pm-byline" className="input" value={meta.byline} onChange={handleChange('byline')} placeholder="Your name" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pm-credit">Credit</label>
                  <input id="pm-credit" className="input" value={meta.credit} onChange={handleChange('credit')} placeholder="Agency or publication" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pm-copyright">Copyright holder</label>
                  <input id="pm-copyright" className="input" value={meta.copyright} onChange={handleChange('copyright')} placeholder="© Your name" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pm-source">Source</label>
                  <input id="pm-source" className="input" value={meta.source} onChange={handleChange('source')} placeholder="Where the image came from" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pm-job">Job ID</label>
                  <input id="pm-job" className="input" value={meta.jobId} onChange={handleChange('jobId')} placeholder="Your reference for this job" />
                </div>
              </div>
              <div className="btn-row" style={{ marginTop: 10 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={saveCreatorRights}>
                  Save these for next time
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={clearSavedCreatorRights}>
                  Clear saved
                </button>
              </div>
            </div>

            <div>
              <span className="eyebrow">Location</span>
              <div className="grid-2" style={{ marginTop: 8 }}>
                <div>
                  <label className="field-label" htmlFor="pm-stadium">Stadium</label>
                  <input id="pm-stadium" className="input" value={meta.stadium} onChange={handleChange('stadium')} placeholder="Celtic Park" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pm-city">City</label>
                  <input id="pm-city" className="input" value={meta.city} onChange={handleChange('city')} placeholder="Glasgow" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pm-state">State or province</label>
                  <input id="pm-state" className="input" value={meta.state} onChange={handleChange('state')} placeholder="Optional" />
                </div>
                <div>
                  <label className="field-label" htmlFor="pm-country">Country</label>
                  <input id="pm-country" className="input" value={meta.country} onChange={handleChange('country')} placeholder="Scotland" />
                </div>
              </div>
            </div>

            <div>
              <div className="roster-head">
                <label className="field-label" htmlFor="pm-keywords" style={{ marginBottom: 0 }}>Keywords</label>
                <span className="ledger-count">{keywordCount}</span>
              </div>
              <textarea
                id="pm-keywords"
                className="textarea"
                value={meta.keywords}
                onChange={handleChange('keywords')}
                placeholder="celtic, bohemians, celtic park, scotland"
              />
              <p className="field-hint">Separate with commas. Clubs, stadium and competition are added for you.</p>
            </div>
          </div>

          <div className="panel-foot">
            <button
              type="button"
              className="btn"
              onClick={() => downloadTextFile(xmp, `${filename}.xmp`, 'application/xml')}
            >
              Download .xmp
            </button>
            <CopyButton
              text={xmp}
              label="Copy XMP"
              successMessage="XMP copied. Paste into Photo Mechanic."
              className="btn btn-secondary"
            />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={async () => {
                if (await copyToClipboard(asJSON())) {
                  toast.success('Fields copied as JSON.');
                } else {
                  toast.error('Your browser blocked the clipboard.');
                }
              }}
            >
              Copy as JSON
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginLeft: 'auto' }}
              onClick={() => {
                autoKeywordsRef.current = [];
                prevCompetitionRef.current = '';
                setMeta(EMPTY_META);
                setCompetition('');
                setHome(null);
                setAway(null);
                setFixtureFacts({ stadium: '', country: '' });
              }}
            >
              Clear everything
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2 className="panel-title">XMP sidecar</h2>
            <span className="eyebrow">{filename}.xmp</span>
          </div>
          <pre className="file-preview">{xmp}</pre>
        </section>
      </div>
    </div>
  );
}
