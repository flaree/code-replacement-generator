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
  "UEFA Champions League": 'CL',
  "UEFA Europa League": 'EL',
  "UEFA Europa Conference League": 'UCOL',
};

// Player Name Formats
export const PLAYER_NAME_FORMATS: string[] = [
  "{playerName} of {team}",
  "{team} player {playerName}",
  "{playerName} ({team})",
  "{team} #{shirtNumber} {playerName}",
  "{playerName} #{shirtNumber} of {team}",
  "{playerName}, {team}",
  "{playerName}",
  "{team} {playerName} #{shirtNumber}",
  "{playerName} - {team} ({shirtNumber})",
];

/**
 * Placeholders advertised for a caption format (built-in or custom).
 *
 * `{delimiter}` (the team's key letter) is still filled in by the generator
 * for anyone with an older custom format that already uses it — it's just
 * not offered here, since a key letter reads as noise in a caption sentence.
 */
export const CAPTION_PLACEHOLDERS = ['{playerName}', '{team}', '{shirtNumber}', '{position}'];

// Code Styles
export const CODE_STYLES = {
  SIMPLE: 'simple' as const,
  COLUMNS: 'columns' as const,
};

export type CodeStyle = typeof CODE_STYLES[keyof typeof CODE_STYLES];

// Name Code Positions
export const NAME_CODE_POSITIONS = {
  PREFIX: 'prefix' as const,
  SUFFIX: 'suffix' as const,
};

export type NameCodePosition = typeof NAME_CODE_POSITIONS[keyof typeof NAME_CODE_POSITIONS];

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
  /** A user-authored format, editable in the "Custom" box regardless of which format is active. */
  customFormat: string;
  /** When true, `customFormat` is used instead of `selectedFormat`. */
  useCustomFormat: boolean;
  shouldChangeGoalkeeperStyle: boolean;
  includeNoNumberPlayers: boolean;
  codeStyle: CodeStyle;
  /** Mark put next to the delimiter for the name-only code in 'simple' style, e.g. the "." in ".b1". */
  nameCodePrefix: string;
  /** Whether that mark goes before the delimiter (".b1") or after it ("b1."). */
  nameCodePosition: NameCodePosition;
}

/**
 * The caption format actually used to generate a file.
 *
 * A blank custom box falls back to the last chosen preset rather than
 * producing an empty caption — flipping the "Custom" radio on shouldn't wipe
 * out the file before you've typed anything.
 */
export const resolveCaptionFormat = (options: CodeOptions): string =>
  options.useCustomFormat && options.customFormat.trim()
    ? options.customFormat
    : options.selectedFormat;

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
  customFormat: '',
  useCustomFormat: false,
  shouldChangeGoalkeeperStyle: false,
  includeNoNumberPlayers: true,
  codeStyle: CODE_STYLES.SIMPLE,
  nameCodePrefix: '.',
  nameCodePosition: NAME_CODE_POSITIONS.PREFIX,
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
