import React from 'react';
import { CodeOptions } from '../constants/config';

interface AdditionalOptionsProps {
  options: CodeOptions;
  setOptions: React.Dispatch<React.SetStateAction<CodeOptions>>;
}

/**
 * AdditionalOptions Component
 * Provides advanced configuration options for code generation
 */
function AdditionalOptions({ options, setOptions }: AdditionalOptionsProps): React.ReactElement {
  const {
    showInfo,
    shouldShorten,
    selectedDate,
    referee,
    competition,
    additionalCodes,
    sortOption,
    formats,
    selectedFormat,
    shouldChangeGoalkeeperStyle,
    includeNoNumberPlayers,
  } = options;
  
  const handleOptionChange = <K extends keyof CodeOptions>(key: K, value: CodeOptions[K]): void => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: value,
    }));
  };

  return (
    <>
      <div>
        <label className="field-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Additional options
          <input
            type="checkbox"
            checked={showInfo}
            onChange={(e) => handleOptionChange('showInfo', e.target.checked)}
            style={{ marginLeft: 4 }}
          />
        </label>
      </div>
      {showInfo && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Additional options</div>
              <div className="card-subtitle">
                Control formats, fixture details, and extra codes.
              </div>
            </div>
          </div>
          <div className="grid-2">
            <div className="stack-md">
              <div>
                <label className="field-label">
                  Replace "Football Club" with "FC"
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={shouldShorten}
                    onChange={(e) => handleOptionChange('shouldShorten', e.target.checked)}
                  />
                  <span className="muted">Shorter club naming in codes</span>
                </label>
              </div>
              <div>
                <label className="field-label">Show players without numbers</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={includeNoNumberPlayers}
                    onChange={(e) => handleOptionChange('includeNoNumberPlayers', e.target.checked)}
                  />
                  <span className="muted">Include players missing shirt numbers</span>
                </label>
              </div>
              <div>
                <label className="field-label">Fixture date</label>
                <input
                  type="date"
                  className="input"
                  value={selectedDate}
                  onChange={(e) => handleOptionChange('selectedDate', e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Format</label>
                <select
                  className="select"
                  value={selectedFormat}
                  onChange={(e) => handleOptionChange('selectedFormat', e.target.value)}
                >
                  {formats.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Separate goalkeeper style</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={shouldChangeGoalkeeperStyle}
                    onChange={(e) => handleOptionChange('shouldChangeGoalkeeperStyle', e.target.checked)}
                  />
                  <span className="muted">Use a different format for GKs</span>
                </label>
              </div>
            </div>
            <div className="stack-md">
              <div>
                <label className="field-label">Referee</label>
                <input
                  type="text"
                  className="input"
                  value={referee}
                  onChange={(e) => handleOptionChange('referee', e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Competition</label>
                <input
                  type="text"
                  className="input"
                  value={competition}
                  placeholder="SSE Airtricity League Mens Premier Division"
                  onChange={(e) => handleOptionChange('competition', e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Additional codes</label>
                <textarea
                  className="textarea"
                  value={additionalCodes}
                  onChange={(e) => handleOptionChange('additionalCodes', e.target.value)}
                  placeholder="iaa    in action against (use a tab between codes and description)"
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const target = e.target as HTMLTextAreaElement;
                      const start = target.selectionStart;
                      const end = target.selectionEnd;
                      handleOptionChange(
                        'additionalCodes',
                        additionalCodes.substring(0, start) + '\t' + additionalCodes.substring(end)
                      );
                      setTimeout(() => {
                        target.selectionStart = target.selectionEnd = start + 1;
                      }, 0);
                    }
                  }}
                />
              </div>
              <div>
                <label className="field-label">Sort players by</label>
                <select
                  className="select"
                  value={sortOption}
                  onChange={(e) => handleOptionChange('sortOption', e.target.value)}
                >
                  <option value="number">Number</option>
                  <option value="position">Position</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdditionalOptions;