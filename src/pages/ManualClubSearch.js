import React, { useState } from 'react';
import './codegen.css';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'http://65.109.20.138:8000';

function ManualClubSearch() {
	const [teamSearch1, setTeamSearch1] = useState('');
	const [teamSearch2, setTeamSearch2] = useState('');
	const [teamResults1, setTeamResults1] = useState([]);
	const [teamResults2, setTeamResults2] = useState([]);
	const [selectedTeam1, setSelectedTeam1] = useState(null); // Store object { id, name }
	const [selectedTeam2, setSelectedTeam2] = useState(null); // Store object { id, name }
	const [generatedCode, setGeneratedCode] = useState('');
	const [showInfo, setShowInfo] = useState(false);
	const [competition, setCompetition] = useState('');
	const [referee, setReferee] = useState('');
	const [additionalCodes, setAdditionalCodes] = useState('');
	const [stadium, setStadium] = useState('');
	const [selectedDate, setSelectedDate] = useState('');


	const handleSearch = async (searchTerm, setResults, resetSelection) => {
		try {
			// Reset the selection and results before searching
			resetSelection();
			setResults([]);

			const response = await fetch(`${BASE_URL}/clubs/search/${searchTerm}`);
			const data = await response.json();
			setResults(data.results.map(team => ({ id: team.id, name: team.name, country: team.country })));
		} catch (error) {
			console.error("Error searching for teams:", error);
			alert("Failed to search for teams. Please try again.");
		}
	};

	const handleGenerate = async () => {
		try {
			setGeneratedCode('');
			const clubInfo = await fetch(`${BASE_URL}/clubs/${selectedTeam1.id}/profile`);
			const clubData = await clubInfo.json();
			setStadium(clubData.stadiumName);
			const response1 = await fetch(`${BASE_URL}/clubs/${selectedTeam1.id}/players`);
			const squad1 = await response1.json();

			const response2 = await fetch(`${BASE_URL}/clubs/${selectedTeam2.id}/players`);
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
					(player) => `${selectedTeam1.name[0]?.toLowerCase() || '-'}${player.number || '-'}\t${player.position === 'Goalkeeper' ? `${selectedTeam1.name} goalkeeper ${player.name || '-'}` : `${player.name || '-'} of ${selectedTeam1.name || '-'}`}`
				), "\n",
				...squad2Filtered.map(
					(player) => `${selectedTeam2.name[0]?.toLowerCase() || '-'}${player.number || '-'}\t${player.position === 'Goalkeeper' ? `${selectedTeam2.name} goalkeeper ${player.name || '-'}` : `${player.name || '-'} of ${selectedTeam2.name || '-'}`}`
				),
			].join('\n');

			const additionalInfo = showInfo
				? `Ref	Referee ${referee || '-'}\nref	referee ${referee || '-'}\n${additionalCodes}\n\n`
				: '';

			const finalCodes = `${additionalInfo}st	${stadium}\n${selectedTeam1.name[0]?.toLowerCase()} ${selectedTeam1.name}\n${selectedTeam1.name[0]?.toLowerCase()}p ${selectedTeam1.name} players\n${selectedTeam1.name[0]?.toLowerCase()}s ${selectedTeam1.name} supporters\n${selectedTeam2.name[0]?.toLowerCase()} ${selectedTeam2.name}\n${selectedTeam2.name[0]?.toLowerCase()}p ${selectedTeam2.name} players\n${selectedTeam2.name[0]?.toLowerCase()}s ${selectedTeam1.name} supporters\n\n\n${code}`;


			setGeneratedCode(finalCodes);
		} catch (error) {
			console.error("Error generating code:", error);
			alert("Failed to generate code. Please try again.");
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
						onClick={() => handleSearch(teamSearch1, setTeamResults1, () => setSelectedTeam1(null))}
						style={{
							padding: '8px 16px',
							marginLeft: '10px',
							backgroundColor: '#007BFF',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Search
					</button>
				</label>
				{teamResults1.length > 0 && (
					<div>
						<label>
							Select Team 1:
							<select
								value={selectedTeam1?.id || ''}
								onChange={(e) => {
									const selected = teamResults1.find(team => team.id === e.target.value);
									setSelectedTeam1(selected || null);
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
						onClick={() => handleSearch(teamSearch2, setTeamResults2, () => setSelectedTeam2(null))}
						style={{
							padding: '8px 16px',
							marginLeft: '10px',
							backgroundColor: '#007BFF',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Search
					</button>
				</label>
				{teamResults2.length > 0 && (
					<div>
						<label>
							Select Team 2:
							<select
								value={selectedTeam2?.id || ''}
								onChange={(e) => {
									const selected = teamResults2.find(team => team.id === e.target.value);
									setSelectedTeam2(selected || null);
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
						</label>
					</div>
				)}
			</div>
			<div>
				<label>
					Additional Info:
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
			<button
				onClick={handleGenerate}
				disabled={!selectedTeam1 || !selectedTeam2}
				style={{
					padding: '10px 20px',
					backgroundColor: !selectedTeam1 || !selectedTeam2 ? '#ccc' : '#007BFF',
					color: 'white',
					border: 'none',
					borderRadius: '4px',
					cursor: !selectedTeam1 || !selectedTeam2 ? 'not-allowed' : 'pointer',
					marginTop: '20px',
				}}
			>
				Generate Code
			</button>
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