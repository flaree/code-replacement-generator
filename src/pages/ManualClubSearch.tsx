import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './codegen.css';
import FixtureDetails from '../components/FixtureDetails';
import TeamPicker from '../components/TeamPicker';
import MatchTeamSlot from '../components/MatchTeamSlot';
import CodeLedger from '../components/CodeLedger';
import { useMatchFile } from '../hooks/useMatchFile';
import { CodeOptions, DEFAULT_CODE_OPTIONS } from '../constants/config';

/**
 * Build a code replacement file for any two clubs, found by name.
 *
 * Choosing a club loads its squad straight away, so the file on the right is
 * always the file you would download. Nothing here needs a Generate step.
 */
export default function ManualClubSearch(): React.ReactElement {
  const [options, setOptions] = useState<CodeOptions>(DEFAULT_CODE_OPTIONS);
  const navigate = useNavigate();

  const {
    home,
    away,
    homePrefix,
    awayPrefix,
    setHomePrefix,
    setAwayPrefix,
    selectHome,
    selectAway,
    clearAway,
    code,
    generation,
    prefixClash,
    busy,
  } = useMatchFile(options);

  const filename = [
    options.selectedDate,
    home.club?.name ?? 'team',
    'v',
    away.club?.name ?? 'team',
  ]
    .filter(Boolean)
    .join('-');

  const openMetadata = () => {
    if (!home.club || !away.club) {
      return;
    }
    const params = new URLSearchParams({
      homeId: home.club.id,
      homeName: home.club.name,
      homeCountry: home.club.country ?? '',
      awayId: away.club.id,
      awayName: away.club.name,
      awayCountry: away.club.country ?? '',
    });
    navigate(`/metadata?${params.toString()}`);
  };

  return (
    <div className="workspace">
      <Toaster position="top-right" />

      <div className="workspace-setup">
        <section className="panel">
          <div className="panel-head">
            <h1 className="panel-title">Team sheet</h1>
            <span className="eyebrow">Search any club</span>
          </div>
          <div className="panel-body stack">
            <MatchTeamSlot
              side="home"
              slot={home}
              prefix={homePrefix}
              onPrefixChange={setHomePrefix}
              clash={prefixClash}
            >
              <TeamPicker
                label="Home club"
                placeholder="e.g. Celtic"
                selected={home.club}
                onSelect={selectHome}
              />
            </MatchTeamSlot>

            <MatchTeamSlot
              side="away"
              slot={away}
              prefix={awayPrefix}
              onPrefixChange={setAwayPrefix}
              clash={prefixClash}
              onClear={clearAway}
            >
              <TeamPicker
                label="Away club"
                placeholder="e.g. Bohemians"
                selected={away.club}
                onSelect={selectAway}
              />
            </MatchTeamSlot>
          </div>
          {home.club && away.club && (
            <div className="panel-foot">
              <button type="button" className="btn btn-secondary" onClick={openMetadata}>
                Build XMP metadata for this fixture
              </button>
            </div>
          )}
        </section>

        <FixtureDetails
          options={options}
          setOptions={setOptions}
          sampleTeam={home.club?.name}
          samplePlayer={
            home.players[0]
              ? { name: home.players[0].name, number: home.players[0].shirtNumber ?? 1 }
              : null
          }
        />
      </div>

      <CodeLedger
        code={code}
        homePrefix={homePrefix}
        awayPrefix={awayPrefix}
        namePrefix={options.nameCodePrefix}
        filename={filename}
        busy={busy}
        generation={generation}
        emptyTitle="Nothing to caption yet"
        emptyText="Find the home club and its squad loads straight into the file. Add the away club for both sides of the fixture."
      />
    </div>
  );
}
