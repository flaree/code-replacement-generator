import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './codegen.css';
import FixtureDetails from '../components/FixtureDetails';
import MatchTeamSlot from '../components/MatchTeamSlot';
import CodeLedger from '../components/CodeLedger';
import { useMatchFile } from '../hooks/useMatchFile';
import { Club, describeApiError, fetchLeagueClubs } from '../services/api';
import { CodeOptions, DEFAULT_CODE_OPTIONS, LEAGUE_CODES } from '../constants/config';

/**
 * Build a code replacement file for a fixture in a supported league.
 *
 * Same workspace as the club search, but the two teams come out of one league
 * rather than being searched for individually.
 */
export default function TeamCodeGenerator(): React.ReactElement {
  const [options, setOptions] = useState<CodeOptions>(DEFAULT_CODE_OPTIONS);
  const [league, setLeague] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(false);
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

  useEffect(() => {
    if (!league) {
      setClubs([]);
      return;
    }
    let cancelled = false;
    setLoadingClubs(true);
    setClubs([]);

    fetchLeagueClubs(LEAGUE_CODES[league])
      .then((data) => {
        if (!cancelled) {
          setClubs(data.clubs);
        }
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        console.error('Error loading league clubs:', error);
        toast.error(
          describeApiError(error, `Could not load the clubs in ${league}. Try again in a moment.`)
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingClubs(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [league]);

  // Each club can only be on one side of the fixture.
  const awayChoices = useMemo(
    () => clubs.filter((club) => club.id !== home.club?.id),
    [clubs, home.club]
  );
  const homeChoices = useMemo(
    () => clubs.filter((club) => club.id !== away.club?.id),
    [clubs, away.club]
  );

  const filename = [
    options.selectedDate,
    home.club?.name ?? 'team',
    'v',
    away.club?.name ?? 'team',
  ]
    .filter(Boolean)
    .join('-');

  const clubSelect = (
    id: string,
    label: string,
    value: string,
    choices: Club[],
    onPick: (_club: Club | null) => void
  ) => (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="select"
        value={value}
        disabled={!league || loadingClubs}
        onChange={(e) => onPick(choices.find((club) => club.id === e.target.value) ?? null)}
      >
        <option value="">
          {loadingClubs ? 'Loading clubs…' : league ? 'Choose a club' : 'Choose a league first'}
        </option>
        {choices.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="workspace">
      <Toaster position="top-right" />

      <div className="workspace-setup">
        <section className="panel">
          <div className="panel-head">
            <h1 className="panel-title">Team sheet</h1>
            <span className="eyebrow">From a league</span>
          </div>
          <div className="panel-body stack">
            <div>
              <label className="field-label" htmlFor="league">
                League
              </label>
              <select
                id="league"
                className="select"
                value={league}
                onChange={(e) => {
                  setLeague(e.target.value);
                  selectHome(null);
                  clearAway();
                  setHomePrefix('');
                }}
              >
                <option value="">Choose a league</option>
                {Object.keys(LEAGUE_CODES).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <MatchTeamSlot
              side="home"
              slot={home}
              prefix={homePrefix}
              onPrefixChange={setHomePrefix}
              clash={prefixClash}
            >
              {clubSelect('home-club', 'Home club', home.club?.id ?? '', homeChoices, selectHome)}
            </MatchTeamSlot>

            <MatchTeamSlot
              side="away"
              slot={away}
              prefix={awayPrefix}
              onPrefixChange={setAwayPrefix}
              clash={prefixClash}
              onClear={clearAway}
            >
              {clubSelect('away-club', 'Away club', away.club?.id ?? '', awayChoices, selectAway)}
            </MatchTeamSlot>
          </div>
          {home.club && away.club && (
            <div className="panel-foot">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const params = new URLSearchParams({
                    homeId: home.club!.id,
                    homeName: home.club!.name,
                    awayId: away.club!.id,
                    awayName: away.club!.name,
                  });
                  navigate(`/metadata?${params.toString()}`);
                }}
              >
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
        filename={filename}
        busy={busy}
        generation={generation}
        emptyTitle="Nothing to caption yet"
        emptyText="Choose a league, then the home club. Its squad loads straight into the file."
      />
    </div>
  );
}
