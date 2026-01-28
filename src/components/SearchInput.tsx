import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  isSearching?: boolean;
}

/**
 * SearchInput Component
 * Reusable search input with button
 */
function SearchInput({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search...", 
  label,
  disabled = false,
  isSearching = false 
}: SearchInputProps): React.ReactElement {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      <div className="generated-inline-row">
        <input
          type="text"
          className="input"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onSearch}
          disabled={disabled || isSearching}
        >
          {isSearching ? 'Searching…' : 'Search'}
        </button>
      </div>
    </div>
  );
}

export default SearchInput;
