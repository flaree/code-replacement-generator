import React from 'react';

function AdditionalOptions({
  showInfo,
  setShowInfo,
  shouldShorten,
  setShouldShorten,
  selectedDate,
  setSelectedDate,
  referee,
  setReferee,
  competition,
  setCompetition,
  additionalCodes,
  setAdditionalCodes,
  sortOption,
  setSortOption,
  formats,
  selectedFormat,
  setSelectedFormat,
  inputStyle,
  shouldChangeGoalkeeperStyle,
  setShouldChangeGoalkeeperStyle,
}) {
  const containerStyle = {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  };

  const textareaStyle = {
    ...inputStyle,
    overflow: 'auto',
    resize: 'vertical',
    height: '100px',
  };

  const checkboxStyle = {
    marginLeft: '10px',
  };

  return (
    <>
      <div>
        <label>
          Additional Options:
          <input
            type="checkbox"
            checked={showInfo}
            onChange={(e) => setShowInfo(e.target.checked)}
            style={checkboxStyle}
          />
        </label>
      </div>
      {showInfo && (
        <div style={containerStyle}>
          <div style={sectionTitleStyle}>Additional Options</div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Replace "Football Club" with "FC":
              <input
                type="checkbox"
                checked={shouldShorten}
                onChange={(e) => setShouldShorten(e.target.checked)}
                style={checkboxStyle}
              />
            </label>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Select Fixture Date:
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
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
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Seperate Goalkeeper Style:
              <input
                type="checkbox"
                checked={shouldChangeGoalkeeperStyle}
                onChange={(e) => setShouldChangeGoalkeeperStyle(e.target.checked)}
                style={checkboxStyle}
              />
            </label>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Referee:
              <input
                type="text"
                value={referee}
                onChange={(e) => setReferee(e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Competition:
              <input
                type="text"
                value={competition}
                placeholder="SSE Airtricity League Mens Premier Division"
                onChange={(e) => setCompetition(e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Additional Codes:
              <textarea
                value={additionalCodes}
                onChange={(e) => setAdditionalCodes(e.target.value)}
                placeholder="iaa    in action against (use a tab between codes and description)"
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    setAdditionalCodes(
                      additionalCodes.substring(0, start) + '\t' + additionalCodes.substring(end)
                    );
                    setTimeout(() => {
                      e.target.selectionStart = e.target.selectionEnd = start + 1;
                    }, 0);
                  }
                }}
                style={textareaStyle}
              />
            </label>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
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
        </div>
      )}
    </>
  );
}

export default AdditionalOptions;