import React from 'react';

function AdditionalOptions({ options, setOptions, inputStyle }) {
  const {
    showInfo,
    shouldShorten,
    selectedDate,
    referee,
    competition,
    additionalCodes,
    sortOption,
    formats,
    selectedFormat,
    shouldChangeGoalkeeperStyle,
    includeNoNumberPlayers,
  } = options;

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

  const handleOptionChange = (key, value) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: value,
    }));
  };

  return (
    <>
      <div>
        <label>
          Additional Options:
          <input
            type="checkbox"
            checked={showInfo}
            onChange={(e) => handleOptionChange('showInfo', e.target.checked)}
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
                onChange={(e) => handleOptionChange('shouldShorten', e.target.checked)}
                style={checkboxStyle}
              />
            </label>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Show Players Without Numbers:
              <input
                type="checkbox"
                checked={includeNoNumberPlayers}
                onChange={(e) => handleOptionChange('includeNoNumberPlayers', e.target.checked)}
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
                onChange={(e) => handleOptionChange('selectedDate', e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Select Format:
              <select
                value={selectedFormat}
                onChange={(e) => handleOptionChange('selectedFormat', e.target.value)}
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
              Separate Goalkeeper Style:
              <input
                type="checkbox"
                checked={shouldChangeGoalkeeperStyle}
                onChange={(e) => handleOptionChange('shouldChangeGoalkeeperStyle', e.target.checked)}
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
                onChange={(e) => handleOptionChange('referee', e.target.value)}
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
                onChange={(e) => handleOptionChange('competition', e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Additional Codes:
              <textarea
                value={additionalCodes}
                onChange={(e) => handleOptionChange('additionalCodes', e.target.value)}
                placeholder="iaa    in action against (use a tab between codes and description)"
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    handleOptionChange(
                      'additionalCodes',
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
                onChange={(e) => handleOptionChange('sortOption', e.target.value)}
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