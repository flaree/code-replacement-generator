/**
 * Utility functions for common operations
 */

/**
 * Download a text file to the user's device
 * @param content - The file content
 * @param filename - The filename to save as
 * @param mimeType - The MIME type (default: text/plain)
 */
export const downloadTextFile = (
  content: string, 
  filename: string, 
  mimeType: string = 'text/plain;charset=utf-8'
): void => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns Today's date
 */
export const getTodayISO = (): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Formatted date string
 */
export const formatDateDDMMYYYY = (dateStr: string): string => {
  if (!dateStr) {
    return '';
  }
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Safely parse JSON from localStorage
 * @param key - The localStorage key
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed value or default
 */
export const getFromLocalStorage = <T = any>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely save to localStorage
 * @param key - The localStorage key
 * @param value - Value to save (will be JSON stringified)
 * @returns Success status
 */
export const saveToLocalStorage = (key: string, value: any): boolean => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Success status
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Escape XML special characters
 * @param str - String to escape
 * @returns Escaped string
 */
export const escapeXml = (str: string | number): string => {
  if (!str && str !== 0) {
    return '';
  }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Get first character of a string in lowercase
 * @param str - Input string
 * @returns First character in lowercase or empty string
 */
export const getFirstCharLowercase = (str: string): string => {
  return str && str.length > 0 ? str[0].toLowerCase() : '';
};
