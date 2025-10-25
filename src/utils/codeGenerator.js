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
}) => {
  const formatPlayer = (player, team, delimiter, shouldChangeGoalkeeperStyle) => {
    if(shouldChangeGoalkeeperStyle && player.position === "Goalkeeper") {
      const goalkeeperFormat = "{team} goalkeeper {playerName}"
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

  const sortPlayers = (players) => {
    if (sortOption === "number") {
      return players.sort((a, b) => {
        if (
          (a.number === undefined || a.number === "-") &&
          b.number !== undefined &&
          b.number !== "-"
        )
          return 1;
        if (
          a.number !== undefined &&
          a.number !== "-" &&
          (b.number === undefined || b.number === "-")
        )
          return -1;
        return Number(a.number) - Number(b.number);
      });
    }
    return players;
  };

  const sortedSquad1 = sortPlayers(squad1);
  const sortedSquad2 = sortPlayers(squad2);

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