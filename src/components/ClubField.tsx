import React from 'react';
import TeamPicker from './TeamPicker';
import { Club } from '../services/api';

interface ClubFieldProps {
  label: string;
  placeholder: string;
  club: Club | null;
  onSelect: (_club: Club) => void;
  onClear: () => void;
}

/**
 * One club on a fixture: a search box until you pick one, then the name.
 *
 * Unlike the code-replacement pages there is no key to assign here, so the
 * settled state is just the club and a way out of it.
 */
export default function ClubField({
  label,
  placeholder,
  club,
  onSelect,
  onClear,
}: ClubFieldProps): React.ReactElement {
  if (!club) {
    return (
      <TeamPicker label={label} placeholder={placeholder} selected={null} onSelect={onSelect} />
    );
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="club-picked">
        <span className="club-picked-name">
          {club.name}
          {club.country && <span className="slot-picked-country"> · {club.country}</span>}
        </span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
