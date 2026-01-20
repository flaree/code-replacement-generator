import React, { useEffect, useState } from 'react';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (_) {
    // ignore
  }
  // Prefer dark by default to match original app
  return 'dark';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
      window.localStorage.setItem('theme', theme);
    } catch (_) {
      // ignore
    }
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{ paddingInline: 10, fontSize: 12 }}
    >
      <span style={{ fontSize: 15 }}>{isLight ? '🌙' : '☀️'}</span>
      <span>{isLight ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}
