import React, { useState, useEffect } from 'react';
import './codegen.css';

const leagues = [
	"League of Ireland Premier Division",
	"League of Ireland First Division",
];

const codes = {
	"League of Ireland Premier Division": 'IR1',
	"League of Ireland First Division": 'IR2',
};

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://transfermarkt-api.fly.dev';

function TeamCodeGenerator() {
	const [selectedLeague, setSelectedLeague] = useState('');
	const [teams, setTeams] = useState([]);
	const [teamMap, setTeamMap] = useState({});
	const [selectedTeam1, setSelectedTeam1] = useState('');
	const [selectedTeam2, setSelectedTeam2] = useState('');
	const [selectedDate, setSelectedDate] = useState('');
	const [generatedCode, setGeneratedCode] = useState('');
	const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
	const [stadium, setStadium] = useState('');
	const [referee, setReferee] = useState('');
	const [additionalCodes, setAdditionalCodes] = useState('');

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
					console.log(teamMapping);
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
			const clubInfo = await fetch(`${BASE_URL}/clubs/${teamMap[selectedTeam1]}/profile`);
			const clubData = await clubInfo.json();
			setStadium(clubData.stadiumName);

			const response1 = await fetch(`${BASE_URL}/clubs/${teamMap[selectedTeam1]}/players`);
			const squad1 = await response1.json();

			const response2 = await fetch(`${BASE_URL}/clubs/${teamMap[selectedTeam2]}/players`);
			const squad2 = await response2.json();

			const squad1Filtered = squad1.players.map((player) => ({
				number: player.foot,
				name: player.name,
				position: player.position,
			}));

			const squad2Filtered = squad2.players.map((player) => ({
				number: player.foot,
				name: player.name,
				position: player.position,
			}));

			const code = [
				...squad1Filtered.map(
					(player) => `${selectedTeam1[0]?.toLowerCase() || '-'}${player.number || '-'}\t${player.position === 'Goalkeeper' ? `${selectedTeam1} goalkeeper ${player.name || '-'}` : `${player.name || '-'} of ${selectedTeam1 || '-'}`}`
				), "\n",

				...squad1Filtered.map(
					(player) => `.${selectedTeam1[0]?.toLowerCase() || '-'}${player.number || '-'}\t${player.name || '-'}`
				), "\n",
				...squad2Filtered.map(
					(player) => `${selectedTeam2[0]?.toLowerCase() || '-'}${player.number || '-'}\t${player.position === 'Goalkeeper' ? `${selectedTeam2} goalkeeper ${player.name || '-'}` : `${player.name || '-'} of ${selectedTeam2 || '-'}`}`
				), "\n",
				...squad2Filtered.map(
					(player) => `.${selectedTeam2[0]?.toLowerCase() || '-'}${player.number || '-'}\t${player.name || '-'}`
				),
			].join('\n');

			const additionalInfo = showAdditionalInfo
				? `Ref	Referee ${referee || '-'}\nref	referee ${referee || '-'}\n${additionalCodes}\n\n`
				: '';

			const finalCodes = `${additionalInfo}st	${stadium || '-'}\n${selectedTeam1[0]?.toLowerCase()} ${selectedTeam1}\n${selectedTeam1[0]?.toLowerCase()}p ${selectedTeam1} players\n${selectedTeam1[0]?.toLowerCase()}s ${selectedTeam1} supporters\n${selectedTeam2[0]?.toLowerCase()} ${selectedTeam2}\n${selectedTeam2[0]?.toLowerCase()}p ${selectedTeam2} players\n${selectedTeam2[0]?.toLowerCase()}s ${selectedTeam1} supporters\n\n\n${code}`;

			setGeneratedCode(finalCodes);
		} catch (error) {
			console.error("Error fetching squad data:", error);
			alert("Failed to fetch squad/club data. Please try again.");
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
								<select
									value={selectedTeam1}
									onChange={(e) => setSelectedTeam1(e.target.value)}
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
							</label>
						</div>
						<div>
							<label>
								Select Away Team:
								<select
									value={selectedTeam2}
									onChange={(e) => setSelectedTeam2(e.target.value)}
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
							</label>
						</div>
						<div>
							<label>
								Select Fixture Date (Optional):
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
								Additional Info:
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
								</div>
							</>
						)}
					</>
				)}
				<button
					type="submit"
					disabled={!selectedLeague || !selectedTeam1 || !selectedTeam2}
					style={{
						padding: '10px 20px',
						backgroundColor: !selectedLeague || !selectedTeam1 || !selectedTeam2 ? '#ccc' : '#007BFF',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: !selectedLeague || !selectedTeam1 || !selectedTeam2 ? 'not-allowed' : 'pointer',
					}}
				>
					Generate Code
				</button>
			</form>
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