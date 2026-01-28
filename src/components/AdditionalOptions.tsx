import React, { useState, useEffect } from 'react';
import { CodeOptions } from '../constants/config';
import Tooltip from './Tooltip';
import toast from 'react-hot-toast';

interface AdditionalOptionsProps {
  options: CodeOptions;
  setOptions: React.Dispatch<React.SetStateAction<CodeOptions>>;
}

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
  
  const [hasSavedOptions, setHasSavedOptions] = useState(false);
  
  const handleOptionChange = <K extends keyof CodeOptions>(key: K, value: CodeOptions[K]): void => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: value,
    }));
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('code_generator_additional_options');
      if (saved) {
        const savedOptions = JSON.parse(saved);
        setOptions((prevOptions) => ({
          ...prevOptions,
          showInfo: true,
          shouldShorten: savedOptions.shouldShorten ?? prevOptions.shouldShorten,
          selectedDate: savedOptions.selectedDate ?? prevOptions.selectedDate,
          referee: savedOptions.referee ?? prevOptions.referee,
          competition: savedOptions.competition ?? prevOptions.competition,
          additionalCodes: savedOptions.additionalCodes ?? prevOptions.additionalCodes,
          sortOption: savedOptions.sortOption ?? prevOptions.sortOption,
          selectedFormat: savedOptions.selectedFormat ?? prevOptions.selectedFormat,
          shouldChangeGoalkeeperStyle: savedOptions.shouldChangeGoalkeeperStyle ?? prevOptions.shouldChangeGoalkeeperStyle,
          includeNoNumberPlayers: savedOptions.includeNoNumberPlayers ?? prevOptions.includeNoNumberPlayers,
        }));
        setHasSavedOptions(true);
      }
    } catch (e) {
      // ignore
    }
  }, [setOptions]);

  const saveAdditionalOptions = () => {
    const payload = {
      shouldShorten,
      selectedDate,
      referee,
      competition,
      additionalCodes,
      sortOption,
      selectedFormat,
      shouldChangeGoalkeeperStyle,
      includeNoNumberPlayers,
    };
    try {
      localStorage.setItem('code_generator_additional_options', JSON.stringify(payload));
      setHasSavedOptions(true);
      toast.success('Additional options saved');
    } catch (e) {
      toast.error('Failed to save options');
    }
  };

  const clearSavedOptions = () => {
    try {
      localStorage.removeItem('code_generator_additional_options');
      setHasSavedOptions(false);
      toast.success('Saved options cleared');
    } catch (e) {
      // ignore
    }
  };

  return (
    <>
      <div>
        <label className="field-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Additional options
          {hasSavedOptions && (
            <span style={{ fontSize: 12, color: 'var(--success-color, #10b981)' }}>✓ Saved</span>
          )}
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
                  title="Fixture date"
                />
              </div>
              <div>
                <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Format
                  <Tooltip content="Choose the delimiter between code and description (tab or comma)">
                    <span style={{ fontSize: '12px', cursor: 'help' }}>ⓘ</span>
                  </Tooltip>
                </label>
                <select
                  className="select"
                  value={selectedFormat}
                  onChange={(e) => handleOptionChange('selectedFormat', e.target.value)}
                  title="Format"
                  aria-label="Format selection"
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
                  placeholder="Referee name"
                  title="Referee"
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
                <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Additional codes
                  <Tooltip content="Add custom Photo Mechanic codes. Use a tab between code and description (e.g., 'iaa' [TAB] 'in action against')">
                    <span style={{ fontSize: '12px', cursor: 'help' }}>ⓘ</span>
                  </Tooltip>
                </label>
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
                  aria-label="Sort players by"
                >
                  <option value="number">Number</option>
                  <option value="position">Position</option>
                </select>
              </div>
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color, #e5e7eb)' }}>
            <button type="button" className="btn btn-secondary" onClick={saveAdditionalOptions}>
              Save options
            </button>
            <button type="button" className="btn btn-ghost" onClick={clearSavedOptions}>
              Clear saved
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdditionalOptions;