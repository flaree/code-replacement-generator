/**
 * Code Generator Utility
 * Generates Photo Mechanic code replacement files from squad data
 */

/**
 * Generates code replacement text for Photo Mechanic
 * @param {Object} params - Generation parameters
 * @param {Array} params.squad1 - Home team squad array
 * @param {Array} params.squad2 - Away team squad array
 * @param {string} params.selectedTeam1 - Home team name
 * @param {string} params.selectedTeam2 - Away team name
 * @param {string} params.delimiter1 - Home team delimiter character
 * @param {string} params.delimiter2 - Away team delimiter character
 * @param {string} params.selectedFormat - Player name format template
 * @param {string} params.sortOption - Sort option ('position' or 'number')
 * @param {boolean} params.showInfo - Whether to include additional match info
 * @param {string} params.referee - Referee name
 * @param {string} params.competition - Competition name
 * @param {string} params.additionalCodes - Custom code replacements
 * @param {boolean} params.shouldShorten - Replace "Football Club" with "FC"
 * @param {Object} params.clubData - Club profile data
 * @param {boolean} params.shouldChangeGoalkeeperStyle - Use different format for goalkeepers
 * @param {boolean} params.ignoreNoNumberPlayers - Filter out players without numbers
 * @returns {string} Generated code replacement text
 */
export const generateCode = ({
  squad1,
  squad2,
  selectedTeam1,
  selectedTeam2,
  delimiter1,
  delimiter2,
  selectedFormat,
  sortOption,
  showInfo,
  referee,
  competition,
  additionalCodes,
  shouldShorten,
  clubData,
  shouldChangeGoalkeeperStyle,
  ignoreNoNumberPlayers,
}) => {
  /**
   * Format a player's name according to the selected template
   * @param {Object} player - Player data
   * @param {string} team - Team name
   * @param {string} delimiter - Team delimiter
   * @param {boolean} shouldChangeGoalkeeperStyle - Use goalkeeper-specific format
   * @returns {string} Formatted player string
   */
  const formatPlayer = (player, team, delimiter, shouldChangeGoalkeeperStyle) => {
    if (shouldChangeGoalkeeperStyle && player.position === "Goalkeeper") {
      const goalkeeperFormat = "{team}'s goalkeeper {playerName}";
      return goalkeeperFormat
        .replace("{playerName}", player.name || "-")
        .replace("{team}", team || "-")
        .replace("{delimiter}", delimiter || "-")
        .replace("{shirtNumber}", player.number || "-");
    }
    return selectedFormat
      .replace("{playerName}", player.name || "-")
      .replace("{team}", team || "-")
      .replace("{delimiter}", delimiter || "-")
      .replace("{shirtNumber}", player.number || "-");
  };

  /**
   * Sort players by number or position
   * @param {Array} players - Array of player objects
   * @returns {Array} Sorted players array
   */
  const sortPlayers = (players) => {
    if (sortOption === "number") {
      return players.sort((a, b) => {
        if (
          (a.number === undefined || a.number === "-") &&
          b.number !== undefined &&
          b.number !== "-"
        ) {
          return 1;
        }
        if (
          a.number !== undefined &&
          a.number !== "-" &&
          (b.number === undefined || b.number === "-")
        ) {
          return -1;
        }
        return Number(a.number) - Number(b.number);
      });
    }
    return players;
  };

  /**
   * Filter out players without shirt numbers if ignoreNoNumberPlayers is true
   * @param {Array} players - Array of player objects
   * @returns {Array} Filtered players array
   */
  const filterPlayers = (players) => {
    if (ignoreNoNumberPlayers) {
      return players.filter(
        (player) => player.number !== undefined && player.number !== "-" && player.number !== null
      );
    }
    return players;
  };

  const filteredSquad1 = filterPlayers(squad1);
  const filteredSquad2 = filterPlayers(squad2);

  const sortedSquad1 = sortPlayers(filteredSquad1);
  const sortedSquad2 = sortPlayers(filteredSquad2);

  const code = [
    ...sortedSquad1.map(
      (player) =>
        `${delimiter1 || "-"}${player.number || "-"}\t${formatPlayer(
          player,
          selectedTeam1,
          delimiter1,
          shouldChangeGoalkeeperStyle
        )}`
    ),
    "\n",
    ...sortedSquad1.map(
      (player) =>
        `.${delimiter1}${player.number || "-"}\t${player.name || "-"}`
    ),
    "\n",
    ...sortedSquad2.map(
      (player) =>
        `${delimiter2 || "-"}${player.number || "-"}\t${formatPlayer(
          player,
          selectedTeam2,
          delimiter2,
          shouldChangeGoalkeeperStyle
        )}`
    ),
    "\n",
    ...sortedSquad2.map(
      (player) =>
        `.${delimiter2}${player.number || "-"}\t${player.name || "-"}`
    ),
  ].join("\n");

  const additionalInfo = showInfo
    ? `Ref\tReferee ${referee || "-"}\nref\treferee ${
        referee || "-"
      }\nco\t${competition}\n${additionalCodes}\n\n`
    : "";

  let finalCodes = `${additionalInfo}st\t${
    clubData?.stadiumName || "-"
  }\n${delimiter1}\t${selectedTeam1}\n${delimiter1}p\t${selectedTeam1} players\n${delimiter1}s\t${selectedTeam1} supporters\n${delimiter2}\t${selectedTeam2}\n${delimiter2}p\t${selectedTeam2} players\n${delimiter2}s\t${selectedTeam2} supporters\n\n\n${code}`;

  if (shouldShorten) {
    finalCodes = finalCodes.replace(/Football Club/g, "FC");
  }

  return finalCodes;
};