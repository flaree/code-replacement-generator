import React, { useEffect, useId, useRef, useState } from 'react';
import { Club } from '../services/api';
import { useClubSearch } from '../hooks/useClubSearch';

interface TeamPickerProps {
  /** Shown above the field. */
  label: string;
  placeholder: string;
  selected: Club | null;
  onSelect: (_club: Club) => void;
}

/**
 * Search-and-pick a club in one control.
 *
 * The old flow was type, press Search, then pick from a separate dropdown that
 * appeared underneath — three interactions and two widgets to choose one team.
 * This searches as you type and lets you take a result with the keyboard.
 */
export default function TeamPicker({
  label,
  placeholder,
  selected,
  onSelect,
}: TeamPickerProps): React.ReactElement {
  const { searchTerm, setSearchTerm, results, searching, error } = useClubSearch();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

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

  const showList = open && searchTerm.trim().length > 0;
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
          value={searchTerm}
          placeholder={selected ? 'Search for a different club' : placeholder}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {searching && <span className="picker-spinner" aria-hidden="true" />}
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
            <li className="picker-empty">
              {searching
                ? 'Searching…'
                : error
                  ? 'Search is unavailable right now. Try again in a moment.'
                  : `No clubs match “${searchTerm.trim()}”.`}
            </li>
          )}
        </ul>
      )}

      {/* Status for screen readers; the spinner and list carry it visually. */}
      <span
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        {showList && !searching && hasResults ? `${results.length} clubs found` : ''}
      </span>
    </div>
  );
}
