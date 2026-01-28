import React from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * ThemeToggle Component
 * Allows users to switch between light and dark themes
 */
export default function ThemeToggle() {
  const { isLight, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{ paddingInline: 10, fontSize: 12 }}
    >
      <span style={{ fontSize: 15 }}>{isLight ? '🌙' : '☀️'}</span>
      <span>{isLight ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}
