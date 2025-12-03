import React, { useState } from "react";
import "./codegen.css";
import AdditionalOptions from "../components/AdditionalOptions";
import { generateCode } from "../utils/codeGenerator";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://api.lensflxre.com"
    : "https://api.lensflxre.com";

const formats = [
  "{playerName} of {team}",
  "{team} player {playerName}",
  "{playerName} ({team})",
  "{team} #{shirtNumber} {playerName}",
  "{playerName}, {team}",
  "{playerName}",
  "{team} {playerName} #{shirtNumber}",
  "{playerName} - {team} (#{shirtNumber})",
];

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
  const [showInfo, setShowInfo] = useState(false);
  const [competition, setCompetition] = useState("");
  const [referee, setReferee] = useState("");
  const [additionalCodes, setAdditionalCodes] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);
  const [shouldShorten, setShouldShorten] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchingTeam1, setSearchingTeam1] = useState(false);
  const [searchingTeam2, setSearchingTeam2] = useState(false);
  const [sortOption, setSortOption] = useState("position");
  const [shouldChangeGoalkeeperStyle, setShouldChangeGoalkeeperStyle] = useState(false);
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

      const response2 = await fetch(
        `${BASE_URL}/clubs/${selectedTeam2.id}/players`
      );
      const squad2 = await response2.json();

      const squad1Filtered = squad1.players.map((player) => ({
        number: player.shirtNumber,
        name: player.name,
        position: player.position,
      }));

      const squad2Filtered = squad2.players.map((player) => ({
        number: player.shirtNumber,
        name: player.name,
        position: player.position,
      }));

      const finalCodes = generateCode({
        squad1: squad1Filtered,
        squad2: squad2Filtered,
        selectedTeam1: selectedTeam1.name,
        selectedTeam2: selectedTeam2.name,
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
        shouldChangeGoalkeeperStyle
      });

      setGeneratedCode(finalCodes);
    } catch (error) {
      console.error("Error generating code:", error);
      alert("Failed to generate code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '8px',
    margin: '8px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const popupStyle = {
    backgroundColor: '#e7f3fe',
    color: '#3178c6',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    fontWeight: 'bold',
    position: 'relative',
    textAlign: 'left',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#3178c6',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }} className="generated-code-page">
      {showPopup && (
        <div style={popupStyle}>
          <button style={closeButtonStyle} onClick={() => setShowPopup(false)}>
            &times;
          </button>
          The project may experience some intermittent issues due to Transfermarkt being strict with scraping. I am working on a more robust solution.
        </div>
      )}
      <div>
        <label>
          Search for Team 1:
          <input
            type="text"
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
            style={inputStyle}
          />
          <button
            onClick={() =>
              handleSearch(teamSearch1, setTeamResults1, () => {
                setSelectedTeam1(null);
                setDelimiter1('');
              }, setSearchingTeam1)
            }
            disabled={searchingTeam1}
            style={{
              padding: '8px 16px',
              marginLeft: '10px',
              backgroundColor: searchingTeam1 ? '#ccc' : '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: searchingTeam1 ? 'not-allowed' : 'pointer',
            }}
          >
            {searchingTeam1 ? 'Searching...' : 'Search'}
          </button>
        </label>
        {teamResults1.length > 0 && (
          <div>
            <label>
              Select Team 1:
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  value={selectedTeam1?.id || ''}
                  onChange={(e) => {
                    const selected = teamResults1.find((team) => team.id === e.target.value);
                    setSelectedTeam1(selected || null);
                    setDelimiter1(selected?.name[0]?.toLowerCase() || '');
                  }}
                  style={inputStyle}
                >
                  <option value="" disabled>
                    -- Select a Team --
                  </option>
                  {teamResults1.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} - {team.country}
                    </option>
                  ))}
                </select>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
                  <label style={{ fontSize: '12px' }}>Delim:</label>
                  <input
                    type="text"
                    value={delimiter1}
                    onChange={(e) => setDelimiter1(e.target.value.slice(0, 1).toLowerCase())}
                    style={{
                      width: '40px',
                      textAlign: 'center',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            </label>
          </div>
        )}
      </div>
      <div>
        <label>
          Search for Team 2:
          <input
            type="text"
            value={teamSearch2}
            placeholder="e.g Bohemians"
            onChange={(e) => setTeamSearch2(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(teamSearch2, setTeamResults2, () => {
                  setSelectedTeam2(null);
                  setDelimiter2('');
                }, setSearchingTeam2);
              }
            }}
            style={inputStyle}
          />
          <button
            onClick={() =>
              handleSearch(teamSearch2, setTeamResults2, () => {
                setSelectedTeam2(null);
                setDelimiter2('');
              }, setSearchingTeam2)
            }
            disabled={searchingTeam2}
            style={{
              padding: '8px 16px',
              marginLeft: '10px',
              backgroundColor: searchingTeam2 ? '#ccc' : '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: searchingTeam2 ? 'not-allowed' : 'pointer',
            }}
          >
            {searchingTeam2 ? 'Searching...' : 'Search'}
          </button>
        </label>
        {teamResults2.length > 0 && (
          <div>
            <label>
              Select Team 2:
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  value={selectedTeam2?.id || ''}
                  onChange={(e) => {
                    const selected = teamResults2.find((team) => team.id === e.target.value);
                    setSelectedTeam2(selected || null);
                    setDelimiter2(selected?.name[0]?.toLowerCase() || '');
                  }}
                  style={inputStyle}
                >
                  <option value="" disabled>
                    -- Select a Team --
                  </option>
                  {teamResults2.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} - {team.country}
                    </option>
                  ))}
                </select>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
                  <label style={{ fontSize: '12px' }}>Delim:</label>
                  <input
                    type="text"
                    value={delimiter2}
                    onChange={(e) => setDelimiter2(e.target.value.slice(0, 1).toLowerCase())}
                    style={{
                      width: '40px',
                      textAlign: 'center',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            </label>
          </div>
        )}
      </div>
      <AdditionalOptions
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        shouldShorten={shouldShorten}
        setShouldShorten={setShouldShorten}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        referee={referee}
        setReferee={setReferee}
        competition={competition}
        setCompetition={setCompetition}
        additionalCodes={additionalCodes}
        setAdditionalCodes={setAdditionalCodes}
        sortOption={sortOption}
        setSortOption={setSortOption}
        formats={formats}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        inputStyle={inputStyle}
        shouldChangeGoalkeeperStyle={shouldChangeGoalkeeperStyle}
        setShouldChangeGoalkeeperStyle={setShouldChangeGoalkeeperStyle}
      />
      <button
        onClick={handleGenerate}
        disabled={!selectedTeam1 || !selectedTeam2 || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: !selectedTeam1 || !selectedTeam2 || loading ? '#ccc' : '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: !selectedTeam1 || !selectedTeam2 || loading ? 'not-allowed' : 'pointer',
          marginTop: '20px',
        }}
      >
        {loading ? 'Generating...' : 'Generate Code'}
      </button>
      {loading && <p style={{ color: 'white' }}>Loading, please wait...</p>}
      {generatedCode && (
        <div>
          <h2>Generated Code:</h2>
          <button
            onClick={() => {
              const blob = new Blob([generatedCode], { type: 'text/plain' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `${selectedDate ? selectedDate.replace(/-/g, '') + '-' : ''}${selectedTeam1.name}-vs-${selectedTeam2.name}.txt`;
              link.click();
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28A745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            Download Code
          </button>
          <pre style={{ fontSize: '12px', color: 'black', background: '#f4f4f4', padding: '10px', textAlign: 'left' }}>
            {generatedCode}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ManualClubSearch;