import React from 'react';
import PropTypes from 'prop-types';

/**
 * TeamSelector Component
 * Reusable component for team selection with delimiter input
 */
function TeamSelector({ 
  label, 
  teams, 
  selectedTeam, 
  onTeamChange, 
  delimiter, 
  onDelimiterChange,
  required = false,
  placeholder = "-- Select a team --"
}) {
  return (
    <div className="generated-column">
      <div className="generated-section-title">{label}</div>
      <label className="field-label">Team</label>
      <div className="generated-inline-row">
        <select
          className="select"
          value={selectedTeam}
          onChange={onTeamChange}
          required={required}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {teams.map((team) => (
            <option key={typeof team === 'string' ? team : team.id} value={typeof team === 'string' ? team : team.id}>
              {typeof team === 'string' ? team : `${team.name} - ${team.country}`}
            </option>
          ))}
        </select>
        <div className="generated-inline-row">
          <span className="muted" style={{ fontSize: 12 }}>Delim</span>
          <input
            type="text"
            className="input generated-delim-input"
            value={delimiter}
            onChange={(e) => onDelimiterChange(e.target.value.slice(0, 1).toLowerCase())}
          />
        </div>
      </div>
    </div>
  );
}

TeamSelector.propTypes = {
  label: PropTypes.string.isRequired,
  teams: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        country: PropTypes.string,
      })
    ])
  ).isRequired,
  selectedTeam: PropTypes.string.isRequired,
  onTeamChange: PropTypes.func.isRequired,
  delimiter: PropTypes.string.isRequired,
  onDelimiterChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default TeamSelector;
