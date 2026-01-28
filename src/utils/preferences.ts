import { CodeOptions } from '../constants/config';

const PREFERENCES_KEY = 'lensflxre_preferences';

export interface UserPreferences {
  lastUsedFormat?: string;
  lastUsedDelimiter?: string;
  codeOptions?: Partial<CodeOptions>;
  recentSearches?: Array<{ id: string; name: string; country?: string }>;
}

export const loadPreferences = (): UserPreferences => {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load preferences:', error);
  }
  return {};
};

export const savePreferences = (preferences: UserPreferences): void => {
  try {
    const existing = loadPreferences();
    const updated = { ...existing, ...preferences };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

export const addToRecentSearches = (team: { id: string; name: string; country?: string }): void => {
  try {
    const prefs = loadPreferences();
    const recentSearches = prefs.recentSearches || [];
    
    // Remove duplicates
    const filtered = recentSearches.filter(t => t.id !== team.id);
    
    // Add to front and limit to 5
    const updated = [team, ...filtered].slice(0, 5);
    
    savePreferences({ recentSearches: updated });
  } catch (error) {
    console.error('Failed to save recent search:', error);
  }
};

export const getRecentSearches = (): Array<{ id: string; name: string; country?: string }> => {
  const prefs = loadPreferences();
  return prefs.recentSearches || [];
};

export const clearRecentSearches = (): void => {
  savePreferences({ recentSearches: [] });
};

export const resetPreferences = (): void => {
  try {
    localStorage.removeItem(PREFERENCES_KEY);
  } catch (error) {
    console.error('Failed to reset preferences:', error);
  }
};
