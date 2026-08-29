import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CODE_STYLES, CodeOptions } from '../constants/config';

const STORAGE_KEY = 'code_generator_additional_options';

interface SamplePlayer {
  name: string;
  number: string | number;
}

interface FixtureDetailsProps {
  options: CodeOptions;
  setOptions: React.Dispatch<React.SetStateAction<CodeOptions>>;
  /** Used to render caption formats as real sentences instead of templates. */
  sampleTeam?: string;
  samplePlayer?: SamplePlayer | null;
}

/**
 * Render a caption format with real names in it.
 *
 * The stored formats are templates like `{playerName} of {team}`. Nobody
 * captions a photo in template syntax, so the picker shows the sentence each
 * option produces for a player already on the sheet.
 */
const renderFormat = (
  format: string,
  team: string,
  player: SamplePlayer
): string =>
  format
    .replace('{playerName}', player.name)
    .replace('{team}', team)
    .replace('{shirtNumber}', String(player.number));

/**
 * Everything about the fixture that isn't the two squads.
 *
 * Collapsed by default because most matchdays don't need it, but the summary
 * line says what is set so you can tell at a glance whether to open it.
 */
export default function FixtureDetails({
  options,
  setOptions,
  sampleTeam = 'Bohemians',
  samplePlayer,
}: FixtureDetailsProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const player = samplePlayer ?? { name: 'Dawson Devoy', number: 10 };
  const namePrefix = options.nameCodePrefix || '.';

  const set = <K extends keyof CodeOptions>(key: K, value: CodeOptions[K]): void => {
    setOptions((previous) => ({ ...previous, [key]: value }));
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored);
      setOptions((previous) => ({
        ...previous,
        shouldShorten: parsed.shouldShorten ?? previous.shouldShorten,
        selectedDate: parsed.selectedDate ?? previous.selectedDate,
        referee: parsed.referee ?? previous.referee,
        competition: parsed.competition ?? previous.competition,
        additionalCodes: parsed.additionalCodes ?? previous.additionalCodes,
        sortOption: parsed.sortOption ?? previous.sortOption,
        selectedFormat: parsed.selectedFormat ?? previous.selectedFormat,
        shouldChangeGoalkeeperStyle:
          parsed.shouldChangeGoalkeeperStyle ?? previous.shouldChangeGoalkeeperStyle,
        includeNoNumberPlayers:
          parsed.includeNoNumberPlayers ?? previous.includeNoNumberPlayers,
        codeStyle: parsed.codeStyle ?? previous.codeStyle,
        nameCodePrefix: parsed.nameCodePrefix ?? previous.nameCodePrefix,
      }));
      setSaved(true);
    } catch {
      // A corrupt entry just means we start from the defaults.
    }
  }, [setOptions]);

  const save = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          shouldShorten: options.shouldShorten,
          selectedDate: options.selectedDate,
          referee: options.referee,
          competition: options.competition,
          additionalCodes: options.additionalCodes,
          sortOption: options.sortOption,
          selectedFormat: options.selectedFormat,
          shouldChangeGoalkeeperStyle: options.shouldChangeGoalkeeperStyle,
          includeNoNumberPlayers: options.includeNoNumberPlayers,
          codeStyle: options.codeStyle,
          nameCodePrefix: options.nameCodePrefix,
        })
      );
      setSaved(true);
      toast.success('Saved. These settings load with every new fixture.');
    } catch {
      toast.error('Your browser blocked local storage, so these settings were not saved.');
    }
  };

  const clear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSaved(false);
      toast.success('Cleared. New fixtures start from the defaults.');
    } catch {
      toast.error('Your browser blocked local storage, so nothing was cleared.');
    }
  };

  // Say what is actually set, so the panel doesn't have to be opened to check.
  const summary = [
    options.competition,
    options.referee && `Ref ${options.referee}`,
    options.selectedDate,
    options.additionalCodes.trim() && 'extra codes',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={`disclosure ${open ? 'disclosure-open' : ''}`}>
      <button
        type="button"
        className="disclosure-summary"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="disclosure-chevron" aria-hidden="true" />
        <span className="disclosure-summary-label">
          Fixture details and caption format
          {summary && <span className="field-hint">{summary}</span>}
        </span>
        {saved && <span className="tag tag-ok">Saved</span>}
      </button>

      {open && (
        <div className="disclosure-panel">
          <div className="stack">
            <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
              <legend className="field-label" style={{ padding: 0 }}>
                Caption format
              </legend>
              <div className="format-list">
                {options.formats.map((format) => (
                  <label
                    key={format}
                    className={`format-option ${
                      options.selectedFormat === format ? 'format-option-checked' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="caption-format"
                      value={format}
                      checked={options.selectedFormat === format}
                      onChange={() => set('selectedFormat', format)}
                    />
                    <span className="format-option-sample">
                      {renderFormat(format, sampleTeam, player)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <span className="field-label">Code style</span>
              <div className="stack-sm">
                <label className="check">
                  <input
                    type="radio"
                    name="code-style"
                    checked={options.codeStyle === CODE_STYLES.SIMPLE}
                    onChange={() => set('codeStyle', CODE_STYLES.SIMPLE)}
                  />
                  <span className="check-text">
                    Simple: <code>b1</code> + <code>{namePrefix}b1</code>
                    <span className="check-sub">
                      <code>b1</code> types the full caption, <code>{namePrefix}b1</code> types
                      just the name. No template setup needed.
                    </span>
                  </span>
                </label>
                {options.codeStyle === CODE_STYLES.SIMPLE && (
                  <div style={{ marginLeft: 25 }}>
                    <label className="field-label" htmlFor="fx-name-prefix">
                      Name-only code prefix
                    </label>
                    <input
                      id="fx-name-prefix"
                      type="text"
                      className="input"
                      style={{ maxWidth: 80 }}
                      value={options.nameCodePrefix}
                      maxLength={3}
                      onChange={(e) => set('nameCodePrefix', e.target.value)}
                    />
                    <p className="field-hint">
                      Defaults to a dot. Change it if <code>.</code> clashes with something else
                      in your workflow — the name-only code becomes{' '}
                      <code>{namePrefix}b1</code> instead of <code>.b1</code>.
                    </p>
                  </div>
                )}
                <label className="check">
                  <input
                    type="radio"
                    name="code-style"
                    checked={options.codeStyle === CODE_STYLES.COLUMNS}
                    onChange={() => set('codeStyle', CODE_STYLES.COLUMNS)}
                  />
                  <span className="check-text">
                    Multi-column: one code per player
                    <span className="check-sub">
                      <code>b1</code> carries caption, name, position, team and number as columns
                      1&ndash;5. Point each field in your Photo Mechanic template at a column:{' '}
                      <code>{'={b1}#1='}</code>, <code>{'={b1}#2='}</code>, and so on.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label className="field-label" htmlFor="fx-competition">
                  Competition
                </label>
                <input
                  id="fx-competition"
                  type="text"
                  className="input"
                  value={options.competition}
                  placeholder="SSE Airtricity League Premier Division"
                  onChange={(e) => set('competition', e.target.value)}
                />
                <p className="field-hint">
                  Added to the file as the code <code>co</code>.
                </p>
              </div>
              <div>
                <label className="field-label" htmlFor="fx-referee">
                  Referee
                </label>
                <input
                  id="fx-referee"
                  type="text"
                  className="input"
                  value={options.referee}
                  placeholder="Rob Harvey"
                  onChange={(e) => set('referee', e.target.value)}
                />
                <p className="field-hint">
                  Added as <code>Ref</code> and <code>ref</code>.
                </p>
              </div>
              <div>
                <label className="field-label" htmlFor="fx-date">
                  Fixture date
                </label>
                <input
                  id="fx-date"
                  type="date"
                  className="input"
                  value={options.selectedDate}
                  onChange={(e) => set('selectedDate', e.target.value)}
                />
                <p className="field-hint">Used to name the downloaded file.</p>
              </div>
              <div>
                <label className="field-label" htmlFor="fx-sort">
                  Order players by
                </label>
                <select
                  id="fx-sort"
                  className="select"
                  value={options.sortOption}
                  onChange={(e) => set('sortOption', e.target.value)}
                >
                  <option value="position">Position on the team sheet</option>
                  <option value="number">Shirt number</option>
                </select>
              </div>
            </div>

            <div>
              <span className="field-label">Squad and naming</span>
              <div className="stack-sm">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={options.shouldShorten}
                    onChange={(e) => set('shouldShorten', e.target.checked)}
                  />
                  <span className="check-text">
                    Shorten “Football Club” to “FC”
                    <span className="check-sub">
                      Keeps captions inside wire-service length limits.
                    </span>
                  </span>
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={options.includeNoNumberPlayers}
                    onChange={(e) => set('includeNoNumberPlayers', e.target.checked)}
                  />
                  <span className="check-text">
                    Include players with no shirt number
                    <span className="check-sub">
                      Trialists and new signings, coded with a dash instead of a number.
                    </span>
                  </span>
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={options.shouldChangeGoalkeeperStyle}
                    onChange={(e) => set('shouldChangeGoalkeeperStyle', e.target.checked)}
                  />
                  <span className="check-text">
                    Caption goalkeepers differently
                    <span className="check-sub">
                      Goalkeepers become “{sampleTeam}&rsquo;s goalkeeper {player.name}”.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="fx-extra">
                Your own codes
              </label>
              <textarea
                id="fx-extra"
                className="textarea"
                value={options.additionalCodes}
                placeholder={'iaa\tin action against'}
                onChange={(e) => set('additionalCodes', e.target.value)}
                onKeyDown={(e) => {
                  // Tab belongs in the file, not in the focus order, while you
                  // are writing code/description pairs — so Escape is the way
                  // back out to the rest of the form.
                  if (e.key === 'Escape') {
                    (e.target as HTMLTextAreaElement).blur();
                    return;
                  }
                  if (e.key !== 'Tab' || e.shiftKey) {
                    return;
                  }
                  e.preventDefault();
                  const target = e.target as HTMLTextAreaElement;
                  const { selectionStart: start, selectionEnd: end } = target;
                  set(
                    'additionalCodes',
                    options.additionalCodes.slice(0, start) +
                      '\t' +
                      options.additionalCodes.slice(end)
                  );
                  requestAnimationFrame(() => {
                    target.selectionStart = target.selectionEnd = start + 1;
                  });
                }}
              />
              <p className="field-hint">
                One per line, with a tab between the code and what it types. Press Tab inside
                this box to insert a tab, and Escape to leave the box.
              </p>
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={save}>
              Save for next time
            </button>
            {saved && (
              <button type="button" className="btn btn-ghost" onClick={clear}>
                Clear saved settings
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
