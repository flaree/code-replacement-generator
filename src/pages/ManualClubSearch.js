import React, { useState } from 'react';
import './codegen.css';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'https://api.lensflxre.com' : 'https://api.lensflxre.com';

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
    const [teamSearch1, setTeamSearch1] = useState('');
    const [teamSearch2, setTeamSearch2] = useState('');
    const [teamResults1, setTeamResults1] = useState([]);
    const [teamResults2, setTeamResults2] = useState([]);
    const [selectedTeam1, setSelectedTeam1] = useState(null); // Store object { id, name }
    const [selectedTeam2, setSelectedTeam2] = useState(null); // Store object { id, name }
    const [delimiter1, setDelimiter1] = useState(''); // Delimiter for Team 1
    const [delimiter2, setDelimiter2] = useState(''); // Delimiter for Team 2
    const [generatedCode, setGeneratedCode] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [competition, setCompetition] = useState('');
    const [referee, setReferee] = useState('');
    const [additionalCodes, setAdditionalCodes] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedFormat, setSelectedFormat] = useState(formats[0]);
    const [shouldShorten, setShouldShorten] = useState(true);
    const [loading, setLoading] = useState(false); // New state for loading indicator
    const [searchingTeam1, setSearchingTeam1] = useState(false);
    const [searchingTeam2, setSearchingTeam2] = useState(false);
    const [sortOption, setSortOption] = useState('position');

    const handleSearch = async (searchTerm, setResults, resetSelection, setSearching) => {
        try {
            setSearching(true); // Set searching to true
            resetSelection();
            setResults([]);

            const response = await fetch(`${BASE_URL}/clubs/search/${searchTerm}`);
            const data = await response.json();
            setResults(data.results.map(team => ({ id: team.id, name: team.name, country: team.country })));
        } catch (error) {
            console.error("Error searching for teams:", error);
            alert("Failed to search for teams. Please try again.");
        } finally {
            setSearching(false); // Set searching to false
        }
    };

    const handleGenerate = async () => {
        try {
            setLoading(true); // Set loading to true when generation starts
            setGeneratedCode('');
            const clubInfo = await fetch(`${BASE_URL}/clubs/${selectedTeam1.id}/profile`);
            const clubData = await clubInfo.json();
            const response1 = await fetch(`${BASE_URL}/clubs/${selectedTeam1.id}/players`);
            const squad1 = await response1.json();

            const response2 = await fetch(`${BASE_URL}/clubs/${selectedTeam2.id}/players`);
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

            const formatPlayer = (player, team, delimiter) => {
                return selectedFormat
                    .replace("{playerName}", player.name || "-")
                    .replace("{team}", team || "-")
                    .replace("{delimiter}", delimiter || "-")
                    .replace("{shirtNumber}", player.number || "-");
            };

            const sortPlayers = (players) => {
				if (sortOption === 'number') {
					return players.sort((a, b) => {
						if ((a.number === undefined || a.number === '-') && (b.number !== undefined && b.number !== '-')) return 1;
						if ((a.number !== undefined && a.number !== '-') && (b.number === undefined || b.number === '-')) return -1;
						return Number(a.number) - Number(b.number);
					});
				}
				return players;
			};

            const sortedSquad1 = sortPlayers(squad1Filtered);
            const sortedSquad2 = sortPlayers(squad2Filtered);

            const code = [
                ...sortedSquad1.map(
                    (player) => `${delimiter1 || '-'}${player.number || '-'}\t${formatPlayer(player, selectedTeam1.name, delimiter1)}`
                ), "\n",

                ...sortedSquad1.map(
                    (player) => `.${delimiter1}${player.number || '-'}\t${player.name || '-'}`
                ), "\n",
                ...sortedSquad2.map(
                    (player) => `${delimiter2 || '-'}${player.number || '-'}\t${formatPlayer(player, selectedTeam2.name, delimiter2)}`
                ), "\n",
                ...sortedSquad2.map(
                    (player) => `.${delimiter2}${player.number || '-'}\t${player.name || '-'}`
                ),
            ].join('\n');

            const additionalInfo = showInfo
                ? `Ref	Referee ${referee || '-'}\nref	referee ${referee || '-'}\nco	${competition}\n${additionalCodes}\n\n`
                : '';

            let finalCodes = `${additionalInfo}st	${clubData.stadiumName || '-'}\n${delimiter1} ${selectedTeam1.name}\n${delimiter1}p ${selectedTeam1.name} players\n${delimiter1}s ${selectedTeam1.name} supporters\n${delimiter2} ${selectedTeam2.name}\n${delimiter2}p ${selectedTeam2.name} players\n${delimiter2}s ${selectedTeam2.name} supporters\n\n\n${code}`;

            // Replace "Football Club" with "FC" if the checkbox is checked
            if (shouldShorten) {
                finalCodes = finalCodes.replace(/Football Club/g, 'FC');
            }

            setGeneratedCode(finalCodes);
        } catch (error) {
            console.error("Error generating code:", error);
            alert("Failed to generate code. Please try again.");
        } finally {
            setLoading(false); // Set loading to false when generation is complete
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

    return (
        <div style={{ padding: '20px', textAlign: 'center' }} className='generated-code-page'>
            <div>
                <label>
                    Search for Team 1:
                    <input
                        type="text"
                        value={teamSearch1}
                        onChange={(e) => setTeamSearch1(e.target.value)}
                        style={inputStyle}
                    />
                    <button
                        onClick={() => handleSearch(teamSearch1, setTeamResults1, () => {
                            setSelectedTeam1(null);
                            setDelimiter1('');
                        }, setSearchingTeam1)}
                        disabled={searchingTeam1} // Disable button when searching
                        style={{
                            padding: '8px 16px',
                            marginLeft: '10px',
                            backgroundColor: searchingTeam1 ? '#ccc' : '#007BFF', // Change color when disabled
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: searchingTeam1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {searchingTeam1 ? 'Searching...' : 'Search'} {/* Update text */}
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
                                        const selected = teamResults1.find(team => team.id === e.target.value);
                                        setSelectedTeam1(selected || null);
                                        setDelimiter1(selected?.name[0]?.toLowerCase() || ''); // Default delimiter
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
                                        onChange={(e) => setDelimiter1(e.target.value.slice(0, 1).toLowerCase())} // Limit to one letter
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
                        onChange={(e) => setTeamSearch2(e.target.value)}
                        style={inputStyle}
                    />
                    <button
                        onClick={() => handleSearch(teamSearch2, setTeamResults2, () => {
                            setSelectedTeam2(null);
                            setDelimiter2('');
                        }, setSearchingTeam2)}
                        disabled={searchingTeam2} // Disable button when searching
                        style={{
                            padding: '8px 16px',
                            marginLeft: '10px',
                            backgroundColor: searchingTeam2 ? '#ccc' : '#007BFF', // Change color when disabled
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: searchingTeam2 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {searchingTeam2 ? 'Searching...' : 'Search'} {/* Update text */}
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
                                        const selected = teamResults2.find(team => team.id === e.target.value);
                                        setSelectedTeam2(selected || null);
                                        setDelimiter2(selected?.name[0]?.toLowerCase() || ''); // Default delimiter
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
                                        onChange={(e) => setDelimiter2(e.target.value.slice(0, 1).toLowerCase())} // Limit to one letter
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
                    Additional Options:
                    <input
                        type="checkbox"
                        checked={showInfo}
                        onChange={(e) => setShowInfo(e.target.checked)}
                        style={{ marginLeft: '10px' }}
                    />
                </label>
            </div>
            {showInfo && (
                <>
                    <div>
                        <label>
                            Replace "Football Club" with "FC":
                            <input
                                type="checkbox"
                                checked={shouldShorten}
                                onChange={(e) => setShouldShorten(e.target.checked)}
                                style={{ marginLeft: '10px' }}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Select Fixture Date:
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={inputStyle}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Select Format:
                            <select
                                value={selectedFormat}
                                onChange={(e) => setSelectedFormat(e.target.value)}
                                style={inputStyle}
                            >
                                {formats.map((format, index) => (
                                    <option key={index} value={format}>
                                        {format}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            Referee:
                            <input
                                type="text"
                                value={referee}
                                onChange={(e) => setReferee(e.target.value)}
                                style={inputStyle}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Competition:
                            <input
                                type="text"
                                value={competition}
                                placeholder='SSE Airtricity League Mens Premier Division'
                                onChange={(e) => setCompetition(e.target.value)}
                                style={inputStyle}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Additional Codes:
                            <textarea
                                value={additionalCodes}
                                onChange={(e) => setAdditionalCodes(e.target.value)}
                                placeholder='iaa    in action against (use a tab between codes and description)'
                                onKeyDown={(e) => {
                                    if (e.key === 'Tab') {
                                        e.preventDefault();
                                        const start = e.target.selectionStart;
                                        const end = e.target.selectionEnd;
                                        setAdditionalCodes(
                                            additionalCodes.substring(0, start) + '\t' + additionalCodes.substring(end)
                                        );
                                        // Move the cursor after the inserted tab
                                        setTimeout(() => {
                                            e.target.selectionStart = e.target.selectionEnd = start + 1;
                                        }, 0);
                                    }
                                }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto'; // Reset height to calculate new height
                                    e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                                }}
                                style={{
                                    ...inputStyle,
                                    overflow: 'hidden', // Prevent scrollbars
                                    resize: 'vertical', // Disable manual resizing
                                }}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Sort Players By:
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="number">Number</option>
                                <option value="position">Position</option>
                            </select>
                        </label>
                    </div>
                </>
            )}
            <button
                onClick={handleGenerate}
                disabled={!selectedTeam1 || !selectedTeam2 || loading} // Disable button when loading
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
                {loading ? 'Generating...' : 'Generate Code'} {/* Show loading text */}
            </button>
            {loading && <p style={{ color: 'white' }}>Loading, please wait...</p>} {/* Show loading indicator */}
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