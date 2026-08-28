import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Club } from '../services/api';

interface LeagueClubPickerProps {
  label: string;
  /** Clubs to search within — already loaded for the chosen league. */
  choices: Club[];
  disabled?: boolean;
  /** Shown in the field when disabled, e.g. "Choose a league first". */
  disabledPlaceholder: string;
  onSelect: (_club: Club) => void;
}

/**
 * Search-and-pick a club out of a league already loaded in memory.
 *
 * A plain `<select>` makes you scroll a whole league to find one club. This
 * filters the same list as you type, the way the club-search field does —
 * just against clubs already on hand instead of a fresh API search.
 */
export default function LeagueClubPicker({
  label,
  choices,
  disabled = false,
  disabledPlaceholder,
  onSelect,
}: LeagueClubPickerProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return choices;
    }
    return choices.filter((club) => club.name.toLowerCase().includes(term));
  }, [choices, searchTerm]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  // Close when focus or a click leaves the control entirely.
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const take = (club: Club) => {
    onSelect(club);
    setSearchTerm('');
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!results.length) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      // Opening the list lands on the first result rather than stepping past it.
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
        return;
      }
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      take(results[activeIndex]);
    }
  };

  const showList = open && !disabled;
  const hasResults = results.length > 0;

  return (
    <div className="picker" ref={wrapRef}>
      <label className="field-label" htmlFor={`${listId}-input`}>
        {label}
      </label>
      <div className="picker-input-wrap">
        <input
          id={`${listId}-input`}
          type="text"
          className="input"
          role="combobox"
          aria-expanded={showList && hasResults}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && hasResults ? `${listId}-opt-${activeIndex}` : undefined
          }
          autoComplete="off"
          disabled={disabled}
          value={searchTerm}
          placeholder={disabled ? disabledPlaceholder : 'Search for a club'}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showList && (
        <ul className="picker-list" id={listId} role="listbox" aria-label={label}>
          {hasResults ? (
            results.map((club, index) => (
              <li key={club.id}>
                <button
                  type="button"
                  id={`${listId}-opt-${index}`}
                  className="picker-option"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => take(club)}
                >
                  <span className="picker-option-name">{club.name}</span>
                  {club.country && (
                    <span className="picker-option-country">{club.country}</span>
                  )}
                </button>
              </li>
            ))
          ) : (
            <li className="picker-empty">No clubs match “{searchTerm.trim()}”.</li>
          )}
        </ul>
      )}
    </div>
  );
}
