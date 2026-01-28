// @ts-nocheck - TODO: Add proper TypeScript types
import React, { useState } from "react";
import "./codegen.css";
import AdditionalOptions from "../components/AdditionalOptions";
import { generateCode } from "../utils/codeGenerator";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://api.lensflxre.com"
    : "https://api.lensflxre.com";
function ManualClubSearch() {
  const [teamSearch1, setTeamSearch1] = useState("");
  const [teamSearch2, setTeamSearch2] = useState("");
  const [teamResults1, setTeamResults1] = useState([]);
  const [teamResults2, setTeamResults2] = useState([]);
  const [selectedTeam1, setSelectedTeam1] = useState(null);
  const [selectedTeam2, setSelectedTeam2] = useState(null);
  const [delimiter1, setDelimiter1] = useState("");
  const [delimiter2, setDelimiter2] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchingTeam1, setSearchingTeam1] = useState(false);
  const [searchingTeam2, setSearchingTeam2] = useState(false);
  const [options, setOptions] = useState({
    showInfo: false,
    shouldShorten: true,
    selectedDate: '',
    referee: '',
    competition: '',
    additionalCodes: '',
    sortOption: 'position',
    formats: [
      "{playerName} of {team}",
      "{team} player {playerName}",
      "{playerName} ({team})",
      "{team} #{shirtNumber} {playerName}",
      "{playerName}, {team}",
      "{playerName}",
      "{team} {playerName} #{shirtNumber}",
      "{playerName} - {team} ({shirtNumber})",
    ],
    selectedFormat: "{playerName} of {team}",
    shouldChangeGoalkeeperStyle: false,
    includeNoNumberPlayers: true,
  });
  
  const [showPopup, setShowPopup] = useState(true); // State to control the visibility of the popup

  const handleSearch = async (searchTerm, setResults, resetSelection, setSearching) => {
    try {
      setSearching(true);
      resetSelection();
      setResults([]);

      const response = await fetch(`${BASE_URL}/clubs/search/${searchTerm}`);
      const data = await response.json();
      setResults(data.results.map(team => ({ id: team.id, name: team.name, country: team.country })));
    } catch (error) {
      console.error("Error searching for teams:", error);
      alert("Failed to search for teams. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleGenerate = async () => {
      try {
      setLoading(true);
      setGeneratedCode("");
      let clubData = null;
      try {
        const clubInfo = await fetch(
          `${BASE_URL}/clubs/${selectedTeam1.id}/profile`
        );
        clubData = await clubInfo.json();
      } catch (error) {
        console.error("Error fetching club data:", error);
        clubData = null;
      }
      const response1 = await fetch(
        `${BASE_URL}/clubs/${selectedTeam1.id}/players`
      );
      const squad1 = await response1.json();

      // If Team 2 is selected, fetch players; otherwise use empty list
      let squad2 = { players: [] };
      if (selectedTeam2) {
        const response2 = await fetch(
          `${BASE_URL}/clubs/${selectedTeam2.id}/players`
        );
        squad2 = await response2.json();
      }

      const squad1Filtered = squad1.players.map((player) => ({
        number: player.shirtNumber,
        name: player.name,
        position: player.position,
      }));

      const squad2Filtered = (squad2.players || []).map((player) => ({
        number: player.shirtNumber,
        name: player.name,
        position: player.position,
      }));

      const finalCodes = generateCode({
        squad1: squad1Filtered,
        squad2: squad2Filtered,
        selectedTeam1: selectedTeam1.name,
        selectedTeam2: selectedTeam2 ? selectedTeam2.name : '',
        delimiter1,
        delimiter2,
        selectedFormat: options.selectedFormat,
        sortOption: options.sortOption,
        showInfo: options.showInfo,
        referee: options.referee,
        competition: options.competition,
        additionalCodes: options.additionalCodes,
        shouldShorten: options.shouldShorten,
        clubData,
        shouldChangeGoalkeeperStyle: options.shouldChangeGoalkeeperStyle,
        includeNoNumberPlayers: options.includeNoNumberPlayers,
      });

      setGeneratedCode(finalCodes);
    } catch (error) {
      console.error("Error generating code:", error);
      alert("Failed to generate code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generated-code-page container-page">
      <div className="card generated-code-card">
        {showPopup && (
          <div className="generated-popup">
            <span>
              The project may experience intermittent issues due to Transfermarkt being strict with scraping. A more
              robust solution is in progress.
            </span>
            <button onClick={() => setShowPopup(false)} aria-label="Dismiss notice">
              &times;
            </button>
          </div>
        )}
        <div className="card-header">
          <div>
            <div className="card-title">Manual club search</div>
            <div className="card-subtitle">
              Search individual clubs and generate Photo Mechanic code replacements.
            </div>
          </div>
          <span className="pill">Home required · Away optional</span>
        </div>
        <div className="generated-grid">
          <div className="generated-column">
            <label className="field-label">Search for Team 1</label>
            <div className="generated-inline-row">
              <input
                type="text"
                className="input"
                value={teamSearch1}
                placeholder="e.g Celtic"
                onChange={(e) => setTeamSearch1(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(teamSearch1, setTeamResults1, () => {
                      setSelectedTeam1(null);
                      setDelimiter1('');
                    }, setSearchingTeam1);
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  handleSearch(teamSearch1, setTeamResults1, () => {
                    setSelectedTeam1(null);
                    setDelimiter1('');
                  }, setSearchingTeam1)
                }
                disabled={searchingTeam1}
              >
                {searchingTeam1 ? 'Searching…' : 'Search'}
              </button>
            </div>
        {teamResults1.length > 0 && (
          <div>
            <label className="field-label">Select Team 1</label>
            <div className="generated-inline-row">
              <select
                className="select"
                value={selectedTeam1?.id || ''}
                onChange={(e) => {
                  const selected = teamResults1.find((team) => team.id === e.target.value);
                  setSelectedTeam1(selected || null);
                  setDelimiter1(selected?.name[0]?.toLowerCase() || '');
                }}
              >
                <option value="" disabled>
                  -- Select a team --
                </option>
                {teamResults1.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} - {team.country}
                  </option>
                ))}
              </select>
              <div className="generated-inline-row">
                <span className="muted" style={{ fontSize: 12 }}>Delim</span>
                <input
                  type="text"
                  className="input generated-delim-input"
                  value={delimiter1}
                  onChange={(e) => setDelimiter1(e.target.value.slice(0, 1).toLowerCase())}
                />
              </div>
            </div>
          </div>
        )}
          </div>
          <div className="generated-column">
            <label className="field-label">Search for Team 2 (optional)</label>
            <div className="generated-inline-row">
              <input
                type="text"
                className="input"
                value={teamSearch2}
                placeholder="e.g. Bohemians"
                onChange={(e) => setTeamSearch2(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(teamSearch2, setTeamResults2, () => {
                      setSelectedTeam2(null);
                      setDelimiter2('');
                    }, setSearchingTeam2);
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  handleSearch(teamSearch2, setTeamResults2, () => {
                    setSelectedTeam2(null);
                    setDelimiter2('');
                  }, setSearchingTeam2)
                }
                disabled={searchingTeam2}
              >
                {searchingTeam2 ? 'Searching…' : 'Search'}
              </button>
            </div>
            {teamResults2.length > 0 && (
              <div>
                <label className="field-label">Select Team 2</label>
                <div className="generated-inline-row">
                  <select
                    className="select"
                    value={selectedTeam2?.id || ''}
                    onChange={(e) => {
                      const selected = teamResults2.find((team) => team.id === e.target.value);
                      setSelectedTeam2(selected || null);
                      setDelimiter2(selected?.name[0]?.toLowerCase() || '');
                    }}
                  >
                    <option value="" disabled>
                      -- Select a team --
                    </option>
                    {teamResults2.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} - {team.country}
                      </option>
                    ))}
                  </select>
                  <div className="generated-inline-row">
                    <span className="muted" style={{ fontSize: 12 }}>Delim</span>
                    <input
                      type="text"
                      className="input generated-delim-input"
                      value={delimiter2}
                      onChange={(e) => setDelimiter2(e.target.value.slice(0, 1).toLowerCase())}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="generated-extra-card">
          <AdditionalOptions options={options} setOptions={setOptions} />
        </div>
        <div className="btn-row">
          <button
            type="button"
            className="btn"
            onClick={handleGenerate}
            disabled={loading || !selectedTeam1}
          >
            {loading ? 'Generating…' : 'Generate code'}
          </button>
        </div>
        {generatedCode && (
          <div className="preview-block" style={{ marginTop: 16 }}>
            <div className="preview-heading">
              <span>Generated code replacements</span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `${selectedTeam1 ? selectedTeam1.name : 'team'}_code_replacements.txt`;
                  link.click();
                }}
              >
                Download .txt
              </button>
            </div>
            <pre className="preview-body">{generatedCode}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManualClubSearch;