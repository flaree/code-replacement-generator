import { useState } from 'react';
import { searchClubs, Club } from '../services/api';

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

/**
 * Custom hook for club search functionality
 * @returns Hook state and handlers
 */
export const useClubSearch = (): UseClubSearchReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setResults([]);
    } finally {
      setSearching(false);
    }
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
