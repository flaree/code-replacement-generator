import React, { useState, useEffect } from 'react';
import './codegen.css';
import AdditionalOptions from '../components/AdditionalOptions';
import { generateCode } from "../utils/codeGenerator";


const codes = {
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

const BASE_URL = process.env.NODE_ENV === 'development' ? 'https://api.lensflxre.com' : 'https://api.lensflxre.com';

function TeamCodeGenerator() {
	const [selectedLeague, setSelectedLeague] = useState('');
	const [teams, setTeams] = useState([]);
	const [teamMap, setTeamMap] = useState({});
	const [selectedTeam1, setSelectedTeam1] = useState('');
	const [selectedTeam2, setSelectedTeam2] = useState('');
	const [generatedCode, setGeneratedCode] = useState('');
	const [loading, setLoading] = useState(false); // New state for loading indicator
	const [delimiter1, setDelimiter1] = useState('');
	const [delimiter2, setDelimiter2] = useState('');
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

	useEffect(() => {
		if (selectedLeague) {
			const fetchTeams = async () => {
				try {
					setTeams([]); // Clear previous teams
					const response = await fetch(`${BASE_URL}/competitions/${codes[selectedLeague]}/clubs`);
					const data = await response.json();

					const teamList = data.clubs.map((club) => club.name);
					setTeams(teamList);
					const teamMapping = data.clubs.reduce((map, club) => {
						map[club.name] = club.id;
						return map;
					}, {});
					setTeamMap(teamMapping);
				} catch (error) {
					console.error("Error fetching teams:", error);
					alert("Failed to fetch teams. Please try again.");
				}
			};
			fetchTeams();
		} else {
			setTeams([]);
		}
	}, [selectedLeague]);

	const handleGenerate = async () => {
		try {
			setLoading(true); // Set loading to true when generation starts
			const clubInfo = await fetch(`${BASE_URL}/clubs/${teamMap[selectedTeam1]}/profile`);
			const clubData = await clubInfo.json();

			const response1 = await fetch(`${BASE_URL}/clubs/${teamMap[selectedTeam1]}/players`);
			const squad1 = await response1.json();

			let squad2 = { players: [] };
			if (selectedTeam2) {
				const response2 = await fetch(`${BASE_URL}/clubs/${teamMap[selectedTeam2]}/players`);
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
					selectedTeam1: selectedTeam1,
					selectedTeam2: selectedTeam2 || '',
					delimiter1,
					delimiter2,
					selectedFormat: options.selectedFormat,
					sortOption: options.sortOption,
					showAdditionalInfo: options.showAdditionalInfo,
					referee: options.referee,
					competition: options.competition,
					additionalCodes: options.additionalCodes,
					shouldShorten: options.shouldShorten,
					clubData,
					shouldChangeGoalkeeperStyle: options.shouldChangeGoalkeeperStyle,
					ignoreNoNumberPlayers: !options.includeNoNumberPlayers,
				  });
			setGeneratedCode(finalCodes);
		} catch (error) {
			console.error("Error fetching squad data:", error);
			alert("Failed to fetch squad/club data. Please try again.");
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
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleGenerate();
				}}
			>
				<div>
					<label>
						Select League:
						<select
							value={selectedLeague}
							onChange={(e) => {
								setSelectedLeague(e.target.value);
								setSelectedTeam1('');
								setSelectedTeam2('');
							}}
							required
							style={inputStyle}
						>
							<option value="" disabled>
								-- Select a League --
							</option>
							{Object.keys(codes).map((league) => (
								<option key={league} value={league}>
									{league}
								</option>
							))}
						</select>
					</label>
				</div>
				{selectedLeague && teams.length > 0 && (
					<>
						<div>
							<label>
								Select Home Team:
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
									<select
										value={selectedTeam1}
										onChange={(e) => {
											setSelectedTeam1(e.target.value);
											setDelimiter1(e.target.value[0]?.toLowerCase() || ''); // Default delimiter to the first letter
										}}
										required
										style={inputStyle}
									>
										<option value="" disabled>
											-- Select Home Team --
										</option>
										{teams.map((team) => (
											<option key={team} value={team}>
												{team}
											</option>
										))}
									</select>
									<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
										<label style={{ fontSize: '12px' }}>Delim:</label>
										<input
											type="text"
											value={delimiter1}
											onChange={(e) => setDelimiter1(e.target.value.slice(0, 1).toLowerCase())} // Limit input to one lowercase letter
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
						<div>
							<label>
								Select Away Team (optional):
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
									<select
										value={selectedTeam2}
										onChange={(e) => {
											setSelectedTeam2(e.target.value);
											setDelimiter2(e.target.value[0]?.toLowerCase() || ''); // Default delimiter to the first letter
										}}
									// optional
										style={inputStyle}
									>
										<option value="" disabled>
											-- Select Away Team --
										</option>
										{teams.map((team) => (
											<option key={team} value={team}>
												{team}
											</option>
										))}
									</select>
									<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
										<label style={{ fontSize: '12px' }}>Delim:</label>
										<input
											type="text"
											value={delimiter2}
											onChange={(e) => setDelimiter2(e.target.value.slice(0, 1).toLowerCase())} // Limit input to one lowercase letter
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
						
			</>
				)}
				<AdditionalOptions
				options={options}
				setOptions={setOptions}
				inputStyle={inputStyle}
				/>
			<button
				type="submit"
				disabled={!selectedLeague || !selectedTeam1 || loading} // Now allow single-team generation (away optional)
				style={{
					padding: '10px 20px',
					backgroundColor: !selectedLeague || !selectedTeam1 || loading ? '#ccc' : '#007BFF',
					color: 'white',
					border: 'none',
					borderRadius: '4px',
					cursor: !selectedLeague || !selectedTeam1 || loading ? 'not-allowed' : 'pointer',
				}}
			>
				{loading ? 'Generating...' : 'Generate Code Replacements'}
			</button>
		</form>
			{ loading && <p style={{ color: 'white' }}>Loading, please wait...</p> } {/* Show loading indicator */ }
	{
		generatedCode && (
			<div>
				<h2>Generated Code:</h2>
				<button
					onClick={() => {
						const blob = new Blob([generatedCode], { type: 'text/plain' });
						const link = document.createElement('a');
						link.href = URL.createObjectURL(blob);
						link.download = `${options.selectedDate ? options.selectedDate.replace(/-/g, '') + '-' : ''}${selectedTeam1}${selectedTeam2 ? '-vs-' + selectedTeam2 : ''}.txt`;
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
					Download Code Replacements
				</button>
				<pre style={{ fontSize: '12px', color: 'black', background: '#f4f4f4', padding: '10px', textAlign: 'left' }}>
					{generatedCode}
				</pre>
			</div>
		)
	}
		</div >
	);
}

export default TeamCodeGenerator;