/**
 * Application-wide configuration constants
 */

// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'https://api.lensflxre.com' 
  : 'https://api.lensflxre.com';

// League Codes
export const LEAGUE_CODES = {
  "League of Ireland Premier Division": 'IR1',
  "League of Ireland First Division": 'IR2',
  "Northern Ireland Football League Premiership": 'NIR1',
  "Scottish Premiership": 'SC1',
  "English Premier League": 'GB1',
  "English Championship": 'GB2',
  "English League One": 'GB3',
  "English League Two": 'GB4',
  "Spanish La Liga": 'ES1',
  "Italian Serie A": 'IT1',
  "German Bundesliga": 'L1',
  "French Ligue 1": 'FR1',
  "Liga Portugal": 'PO1',
  "Brazilian Serie A": 'BRA1',
  "Major League Soccer": 'MLS1',
  "Dutch Eredivisie": 'NL1',
};

// Player Name Formats
export const PLAYER_NAME_FORMATS = [
  "{playerName} of {team}",
  "{team} player {playerName}",
  "{playerName} ({team})",
  "{team} #{shirtNumber} {playerName}",
  "{playerName}, {team}",
  "{playerName}",
  "{team} {playerName} #{shirtNumber}",
  "{playerName} - {team} ({shirtNumber})",
];

// Default Code Generation Options
export const DEFAULT_CODE_OPTIONS = {
  showInfo: false,
  shouldShorten: true,
  selectedDate: '',
  referee: '',
  competition: '',
  additionalCodes: '',
  sortOption: 'position',
  formats: PLAYER_NAME_FORMATS,
  selectedFormat: "{playerName} of {team}",
  shouldChangeGoalkeeperStyle: false,
  includeNoNumberPlayers: true,
};

// Sort Options
export const SORT_OPTIONS = {
  POSITION: 'position',
  NUMBER: 'number',
};

// Theme Configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const DEFAULT_THEME = THEMES.DARK;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  CREATOR_RIGHTS: 'photo_meta_creator_rights',
};
