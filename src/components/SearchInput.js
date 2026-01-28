import React from 'react';
import PropTypes from 'prop-types';

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
}) {
  const handleKeyDown = (e) => {
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

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  isSearching: PropTypes.bool,
};

export default SearchInput;
