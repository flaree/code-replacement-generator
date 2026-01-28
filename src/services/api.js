import { API_BASE_URL } from '../constants/config';

/**
 * API Service for interacting with the Lensflxre backend
 */

/**
 * Fetch league clubs by competition code
 * @param {string} competitionCode - The competition code (e.g., 'GB1')
 * @returns {Promise<Object>} - Response containing clubs array
 */
export const fetchLeagueClubs = async (competitionCode) => {
  const response = await fetch(`${API_BASE_URL}/competitions/${competitionCode}/clubs`);
  if (!response.ok) {
    throw new Error(`Failed to fetch clubs for competition ${competitionCode}`);
  }
  return response.json();
};

/**
 * Fetch club profile by club ID
 * @param {string} clubId - The club ID
 * @returns {Promise<Object>} - Club profile data
 */
export const fetchClubProfile = async (clubId) => {
  const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/profile`);
  if (!response.ok) {
    throw new Error(`Failed to fetch profile for club ${clubId}`);
  }
  return response.json();
};

/**
 * Fetch club players by club ID
 * @param {string} clubId - The club ID
 * @returns {Promise<Object>} - Response containing players array
 */
export const fetchClubPlayers = async (clubId) => {
  const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/players`);
  if (!response.ok) {
    throw new Error(`Failed to fetch players for club ${clubId}`);
  }
  return response.json();
};

/**
 * Search for clubs by name
 * @param {string} searchTerm - The search term
 * @returns {Promise<Object>} - Response containing search results
 */
export const searchClubs = async (searchTerm) => {
  const response = await fetch(`${API_BASE_URL}/clubs/search/${encodeURIComponent(searchTerm)}`);
  if (!response.ok) {
    throw new Error(`Failed to search for clubs with term "${searchTerm}"`);
  }
  return response.json();
};

/**
 * Fetch full squad data for code generation
 * @param {string} clubId - The club ID
 * @returns {Promise<Object>} - Object containing both profile and player data
 */
export const fetchFullSquadData = async (clubId) => {
  const [profile, players] = await Promise.all([
    fetchClubProfile(clubId).catch(() => null),
    fetchClubPlayers(clubId)
  ]);
  
  return { profile, players };
};
