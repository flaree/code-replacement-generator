import { useState, useEffect } from 'react';
import { STORAGE_KEYS, DEFAULT_THEME, THEMES, Theme } from '../constants/config';

/**
 * Get initial theme from localStorage or default
 * @returns Theme value
 */
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME;
  }
  
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === THEMES.LIGHT || stored === THEMES.DARK) {
      return stored;
    }
  } catch (_) {
    // Ignore localStorage errors
  }
  
  return DEFAULT_THEME;
};

interface UseThemeReturn {
  theme: Theme;
  isLight: boolean;
  toggleTheme: () => void;
}

/**
 * Custom hook for theme management
 * @returns Theme state and toggle function
 */
export const useTheme = (): UseThemeReturn => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    try {
      document.documentElement.setAttribute(
        'data-theme', 
        theme === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK
      );
      window.localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (_) {
      // Ignore localStorage errors
    }
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme(prev => prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
  };

  const isLight: boolean = theme === THEMES.LIGHT;

  return { theme, isLight, toggleTheme };
};
