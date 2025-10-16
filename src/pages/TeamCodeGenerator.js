import React, { useState, useEffect } from 'react';
import './codegen.css';


const leagues = [
	"League of Ireland Premier Division",
	"League of Ireland First Division",
	"Northern Ireland Football League Premiership",
	"Scottish Premiership",
	"English Premier League",
	"English Championship",
	"English League One",
	"English League Two",
	"Spanish La Liga",
	"Italian Serie A",
	"German Bundesliga",
	"French Ligue 1",
	];

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
	"German Bundesliga": 'DE1',
	"French Ligue 1": 'FR1',
};

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://api.lensflxre.com';

const formats = [
    "{playerName} of {team}",
    "{team} player {playerName}",
    "{playerName} ({team})",
	"{team} #{shirtNumber} {playerName}",
	"{playerName}, {team}",
	"{playerName}",
	"{team} {playerName} #{shirtNumber}",
	"{playerName} - {team} ({shirtNumber})",
];


function TeamCodeGenerator() {
	const [selectedLeague, setSelectedLeague] = useState('');
	const [teams, setTeams] = useState([]);
	const [teamMap, setTeamMap] = useState({});
	const [selectedTeam1, setSelectedTeam1] = useState('');
	const [selectedTeam2, setSelectedTeam2] = useState('');
	const [selectedDate, setSelectedDate] = useState('');
	const [generatedCode, setGeneratedCode] = useState('');
	const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
	const [referee, setReferee] = useState('');
	const [additionalCodes, setAdditionalCodes] = useState('');
	const [delimiter1, setDelimiter1] = useState('');
	const [delimiter2, setDelimiter2] = useState('');
	const [shouldShorten, setShouldShorten] = useState(true);
	const [selectedFormat, setSelectedFormat] = useState(formats[0]); // Default to the first format
	const [loading, setLoading] = useState(false); // New state for loading indicator


	useEffect(() => {
		if (selectedLeague) {
			const fetchTeams = async () => {
				try {
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

			const response2 = await fetch(`${BASE_URL}/clubs/${teamMap[selectedTeam2]}/players`);
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

			const code = [
				...squad1Filtered.map(
					(player) => `${delimiter1 || '-'}${player.number || '-'}\t${formatPlayer(player, selectedTeam1, delimiter1)}`
				), "\n",

				...squad1Filtered.map(
					(player) => `.${delimiter1}${player.number || '-'}\t${player.name || '-'}`
				), "\n",
				...squad2Filtered.map(
					(player) => `${delimiter2 || '-'}${player.number || '-'}\t${formatPlayer(player, selectedTeam2, delimiter2)}`
				), "\n",
				...squad2Filtered.map(
					(player) => `.${delimiter2}${player.number || '-'}\t${player.name || '-'}`
				),
			].join('\n');

			const additionalInfo = showAdditionalInfo
				? `Ref	Referee ${referee || '-'}\nref	referee ${referee || '-'}\n${additionalCodes}\n\n`
				: '';

			let finalCodes = `${additionalInfo}st	${clubData.stadiumName || '-'}\n${delimiter1} ${selectedTeam1}\n${delimiter1}p ${selectedTeam1} players\n${delimiter1}s ${selectedTeam1} supporters\n${delimiter2} ${selectedTeam2}\n${delimiter2}p ${selectedTeam2} players\n${delimiter2}s ${selectedTeam2} supporters\n\n\n${code}`;

			if (shouldShorten) {
				finalCodes = finalCodes.replace(/Football Club/g, 'FC');
			}

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
		<div style={{ padding: '20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }} className='generated-code-page'>
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
							{leagues.map((league) => (
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
								Select Away Team:
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
									<select
										value={selectedTeam2}
										onChange={(e) => {
											setSelectedTeam2(e.target.value);
											setDelimiter2(e.target.value[0]?.toLowerCase() || ''); // Default delimiter to the first letter
										}}
										required
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
						<div>
							<label>
								Additional Options:
								<input
									type="checkbox"
									checked={showAdditionalInfo}
									onChange={(e) => setShowAdditionalInfo(e.target.checked)}
									style={{ marginLeft: '10px' }}
								/>
							</label>
						</div>
						{showAdditionalInfo && (
							<>
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
										Additional Codes:
										<textarea
											value={additionalCodes}
											onChange={(e) => setAdditionalCodes(e.target.value)}
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
												resize: 'none', // Disable manual resizing
											}}
										/>
									</label>
									<label>
										Replace 'Football Club' with 'FC':
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
							</>
						)}
					</>
				)}
				<button
					type="submit"
					disabled={!selectedLeague || !selectedTeam1 || !selectedTeam2 || loading} // Disable button when loading
					style={{
						padding: '10px 20px',
						backgroundColor: !selectedLeague || !selectedTeam1 || !selectedTeam2 || loading ? '#ccc' : '#007BFF',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: !selectedLeague || !selectedTeam1 || !selectedTeam2 || loading ? 'not-allowed' : 'pointer',
					}}
				>
					{loading ? 'Generating...' : 'Generate Code'} {/* Show loading text */}
				</button>
			</form>
			{loading && <p style={{ color: 'white' }}>Loading, please wait...</p>} {/* Show loading indicator */}
			{generatedCode && (
				<div>
					<h2>Generated Code:</h2>
					<button
						onClick={() => {
							const blob = new Blob([generatedCode], { type: 'text/plain' });
							const link = document.createElement('a');
							link.href = URL.createObjectURL(blob);
							link.download = `${selectedDate ? selectedDate.replace(/-/g, '') + '-' : ''}${selectedTeam1}-vs-${selectedTeam2}.txt`;
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

export default TeamCodeGenerator;