import { useState } from 'react';
import { searchClubs } from '../services/api';

/**
 * Custom hook for club search functionality
 * @returns {Object} Hook state and handlers
 */
export const useClubSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    try {
      setSearching(true);
      setError(null);
      setResults([]);
      
      const data = await searchClubs(searchTerm);
      setResults(data.results.map(team => ({
        id: team.id,
        name: team.name,
        country: team.country
      })));
    } catch (err) {
      console.error('Club search error:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectClub = (club) => {
    setSelectedClub(club);
  };

  const reset = () => {
    setSearchTerm('');
    setResults([]);
    setSelectedClub(null);
    setError(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    selectedClub,
    searching,
    error,
    handleSearch,
    selectClub,
    reset,
  };
};
