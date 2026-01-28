import { useState, useCallback, useRef, useEffect } from 'react';
import { searchClubs, Club } from '../services/api';
import { debounce } from '../utils/debounce';

interface UseClubSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: Club[];
  selectedClub: Club | null;
  searching: boolean;
  error: string | null;
  handleSearch: () => Promise<void>;
  selectClub: (club: Club | null) => void;
  reset: () => void;
}

export const useClubSearch = (): UseClubSearchReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      
      const data = await searchClubs(term);
      setResults(data.results.map(team => ({
        id: team.id,
        name: team.name,
        country: team.country
      })));
    } catch (err) {
      console.error('Club search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useRef(debounce(performSearch, 500)).current;

  // Auto-search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearch = async () => {
    await performSearch(searchTerm);
  };

  const selectClub = (club: Club | null): void => {
    setSelectedClub(club);
  };

  const reset = (): void => {
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
