import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

/**
 * AdditionalOptions Component
 * Provides advanced configuration options for code generation
 */
function AdditionalOptions({ options, setOptions }) {
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
  const handleOptionChange = (key, value) => {
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
                      const start = e.target.selectionStart;
                      const end = e.target.selectionEnd;
                      handleOptionChange(
                        'additionalCodes',
                        additionalCodes.substring(0, start) + '\t' + additionalCodes.substring(end)
                      );
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + 1;
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

AdditionalOptions.propTypes = {
  options: PropTypes.shape({
    showInfo: PropTypes.bool,
    shouldShorten: PropTypes.bool,
    selectedDate: PropTypes.string,
    referee: PropTypes.string,
    competition: PropTypes.string,
    additionalCodes: PropTypes.string,
    sortOption: PropTypes.string,
    formats: PropTypes.arrayOf(PropTypes.string),
    selectedFormat: PropTypes.string,
    shouldChangeGoalkeeperStyle: PropTypes.bool,
    includeNoNumberPlayers: PropTypes.bool,
  }).isRequired,
  setOptions: PropTypes.func.isRequired,
};

export default AdditionalOptions;