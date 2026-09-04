/**
 * Code Generator Utility
 * Generates Photo Mechanic code replacement files from squad data
 */

import { CodeStyle, InitialsDelimiterMode, NameCodePosition } from '../constants/config';

export interface Player {
  number?: string | number;
  name: string;
  position: string;
}

export interface ClubData {
  stadiumName?: string;
  name?: string;
  addressLine3?: string;
  manager?: string;
}

export interface GenerateCodeParams {
  squad1: Player[];
  squad2: Player[];
  selectedTeam1: string;
  selectedTeam2: string;
  delimiter1: string;
  delimiter2: string;
  selectedFormat: string;
  sortOption: string;
  showInfo?: boolean;
  referee?: string;
  competition?: string;
  additionalCodes?: string;
  shouldShorten: boolean;
  clubData?: ClubData | null;
  clubData2?: ClubData | null;
  shouldChangeGoalkeeperStyle: boolean;
  ignoreNoNumberPlayers?: boolean;
  /**
   * 'simple' (default) emits two rows per player: the full caption under the
   * plain code, and just the name under one with a mark attached (`.` by
   * default, as a prefix or suffix — see `nameCodePrefix`/`nameCodePosition`).
   * 'columns' emits one row per player with several tab-separated fields, so
   * a Photo Mechanic template can pull different columns into different
   * metadata fields with `={code}#1=`, `={code}#2=`, etc.
   */
  codeStyle?: CodeStyle;
  /** Mark for the name-only code in 'simple' style, e.g. the "." in ".b1". Defaults to ".". */
  nameCodePrefix?: string;
  /** Whether the mark goes before the delimiter (".b1") or after it ("b1."). Defaults to 'prefix'. */
  nameCodePosition?: NameCodePosition;
  /** Appends a second set of codes keyed by initials rather than shirt number. */
  initialsCodes?: boolean;
  /** Whether those initials codes carry the team key, go without it, or both. Defaults to 'with'. */
  initialsDelimiterMode?: InitialsDelimiterMode;
}

/**
 * A player's initials, as used for an initials code.
 *
 * The first letter of each of the first two names — "Tomas Frühwald" becomes
 * "tf". Accents are left alone rather than stripped, so "Öztürk" keeps its
 * own first letter instead of silently becoming "z".
 */
export const playerInitials = (name: string): string =>
  (name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.slice(0, 1))
    .join("")
    .toLowerCase();

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
  clubData2,
  shouldChangeGoalkeeperStyle,
  ignoreNoNumberPlayers,
  codeStyle = "simple",
  nameCodePrefix: rawNameCodePrefix = ".",
  nameCodePosition = "prefix",
  initialsCodes = false,
  initialsDelimiterMode = "with",
}: GenerateCodeParams): string => {
  // An emptied-out mark would make the name-only code identical to the
  // caption code, silently overwriting it — a dot is the safe fallback.
  const nameCodePrefix = rawNameCodePrefix || ".";
  /**
   * Fill in a format's placeholders, every occurrence of each.
   *
   * A curated preset only ever uses a placeholder once, but a user-authored
   * custom format might repeat one (e.g. wanting the number twice) —
   * `String.replace` with a plain string only swaps the first match, so this
   * uses split/join instead to catch every occurrence.
   */
  const fillTemplate = (
    template: string,
    values: Record<string, string>
  ): string =>
    Object.entries(values).reduce(
      (result, [token, value]) => result.split(token).join(value),
      template
    );

  const formatPlayer = (
    player: Player,
    team: string,
    delimiter: string,
    shouldChangeGoalkeeperStyle: boolean
  ): string => {
    const values = {
      "{playerName}": player.name || "-",
      "{team}": team || "-",
      "{delimiter}": delimiter || "-",
      "{shirtNumber}": String(player.number || "-"),
      "{position}": player.position || "-",
    };
    if (shouldChangeGoalkeeperStyle && player.position === "Goalkeeper") {
      return fillTemplate("{team}'s goalkeeper {playerName}", values);
    }
    return fillTemplate(selectedFormat, values);
  };

  /**
   * Sort players by number or position
   * @param players - Array of player objects
   * @returns Sorted players array
   */
  const sortPlayers = (players: Player[]): Player[] => {
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
   * @param players - Array of player objects
   * @returns Filtered players array
   */
  const filterPlayers = (players: Player[]): Player[] => {
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

  const number = (player: Player) => String(player.number || "-");

  /**
   * One squad's rows, in whichever style was asked for.
   *
   * `keyOf` decides what a player's code looks like, so the same shapes serve
   * both the shirt-number codes and the initials ones — they only differ in
   * the key, never in what the key types out.
   *
   * Columns mode packs everything a template might want (caption, name,
   * position, team, number) into one row per player, ordered so `#1` is
   * always the full caption and `#5` is always the number — stable column
   * positions are what let a saved Photo Mechanic template keep working
   * fixture after fixture.
   */
  const buildSquadLines = (
    players: Player[],
    team: string,
    delimiter: string,
    keyOf: (_player: Player) => string
  ): string[] => {
    if (codeStyle === "columns") {
      return players.map((player) => {
        const caption = formatPlayer(player, team, delimiter, shouldChangeGoalkeeperStyle);
        return [
          keyOf(player),
          caption,
          player.name || "-",
          player.position || "-",
          team || "-",
          number(player),
        ].join("\t");
      });
    }

    return [
      ...players.map(
        (player) =>
          `${keyOf(player)}\t${formatPlayer(
            player,
            team,
            delimiter,
            shouldChangeGoalkeeperStyle
          )}`
      ),
      "\n",
      ...players.map((player) => {
        const base = keyOf(player);
        const nameCode =
          nameCodePosition === "suffix" ? `${base}${nameCodePrefix}` : `${nameCodePrefix}${base}`;
        return `${nameCode}\t${player.name || "-"}`;
      }),
    ];
  };

  const byNumber = (delimiter: string) => (player: Player) =>
    `${delimiter || "-"}${number(player)}`;

  /**
   * The initials blocks, appended after the numbered ones.
   *
   * A player with no name has no initials to key on, so they are left out of
   * this block rather than given a code that is just the team key.
   */
  const buildInitialsLines = (
    players: Player[],
    team: string,
    delimiter: string
  ): string[][] => {
    if (!initialsCodes) {
      return [];
    }
    const named = players.filter((player) => playerInitials(player.name));
    if (named.length === 0) {
      return [];
    }

    const blocks: string[][] = [];
    if (initialsDelimiterMode === "with" || initialsDelimiterMode === "both") {
      blocks.push(
        buildSquadLines(
          named,
          team,
          delimiter,
          (player) => `${delimiter || "-"}${playerInitials(player.name)}`
        )
      );
    }
    if (initialsDelimiterMode === "without" || initialsDelimiterMode === "both") {
      blocks.push(
        buildSquadLines(named, team, delimiter, (player) => playerInitials(player.name))
      );
    }
    return blocks;
  };

  const initialsBlocks = [
    ...buildInitialsLines(sortedSquad1, selectedTeam1, delimiter1),
    ...buildInitialsLines(sortedSquad2, selectedTeam2, delimiter2),
  ];

  const code = [
    ...buildSquadLines(sortedSquad1, selectedTeam1, delimiter1, byNumber(delimiter1)),
    "\n",
    ...buildSquadLines(sortedSquad2, selectedTeam2, delimiter2, byNumber(delimiter2)),
    ...initialsBlocks.flatMap((block) => ["\n", ...block]),
  ].join("\n");

  const additionalInfo = showInfo
    ? `Ref\tReferee ${referee || "-"}\nref\treferee ${
        referee || "-"
      }\nco\t${competition}\n${additionalCodes}\n\n`
    : "";

  // Build team 2 info only if team 2 exists
  const team2Info = selectedTeam2 
    ? `${delimiter2}\t${selectedTeam2}\n${delimiter2}p\t${selectedTeam2} players\n${delimiter2}s\t${selectedTeam2} supporters\n${delimiter2}m\t${selectedTeam2} manager ${clubData2?.manager || "-"}\n`
    : "";

  let finalCodes = `${additionalInfo}st\t${
    clubData?.stadiumName || "-"
  }\n${delimiter1}\t${selectedTeam1}\n${delimiter1}p\t${selectedTeam1} players\n${delimiter1}s\t${selectedTeam1} supporters\n${delimiter1}m\t${selectedTeam1} manager ${clubData?.manager || "-"}\n${team2Info}\n\n${code}`;

  if (shouldShorten) {
    finalCodes = finalCodes.replace(/Football Club/g, "FC");
  }

  return finalCodes;
};