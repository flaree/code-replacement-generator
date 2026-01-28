import React from 'react';

type Team = string | { id: string; name: string; country?: string };

interface TeamSelectorProps {
  label: string;
  teams: Team[];
  selectedTeam: string;
  onTeamChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  delimiter: string;
  onDelimiterChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

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
}: TeamSelectorProps): React.ReactElement {
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

export default TeamSelector;
