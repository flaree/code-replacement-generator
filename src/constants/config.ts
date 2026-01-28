export const API_BASE_URL: string = process.env.NODE_ENV === 'development' 
  ? 'https://api.lensflxre.com' 
  : 'https://api.lensflxre.com';

// League Codes
export const LEAGUE_CODES: Record<string, string> = {
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
export const PLAYER_NAME_FORMATS: string[] = [
  "{playerName} of {team}",
  "{team} player {playerName}",
  "{playerName} ({team})",
  "{team} #{shirtNumber} {playerName}",
  "{playerName}, {team}",
  "{playerName}",
  "{team} {playerName} #{shirtNumber}",
  "{playerName} - {team} ({shirtNumber})",
];

// Types for Code Generation Options
export interface CodeOptions {
  showInfo: boolean;
  shouldShorten: boolean;
  selectedDate: string;
  referee: string;
  competition: string;
  additionalCodes: string;
  sortOption: string;
  formats: string[];
  selectedFormat: string;
  shouldChangeGoalkeeperStyle: boolean;
  includeNoNumberPlayers: boolean;
}

// Default Code Generation Options
export const DEFAULT_CODE_OPTIONS: CodeOptions = {
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
  POSITION: 'position' as const,
  NUMBER: 'number' as const,
};

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

// Theme Configuration
export const THEMES = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
};

export type Theme = typeof THEMES[keyof typeof THEMES];

export const DEFAULT_THEME: Theme = THEMES.DARK;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  CREATOR_RIGHTS: 'photo_meta_creator_rights',
};
