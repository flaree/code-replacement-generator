import React, { useEffect, useId, useState } from 'react';
import { TeamSlot } from '../hooks/useMatchFile';

interface MatchTeamSlotProps {
  side: 'home' | 'away';
  slot: TeamSlot;
  prefix: string;
  onPrefixChange: (_value: string) => void;
  /** Whether the other team is using the same prefix. */
  clash?: boolean;
  onClear?: () => void;
  /** The control used to choose the club — a search box or a league dropdown. */
  children: React.ReactNode;
}

/**
 * One team on the sheet: who they are, and the key you press for them.
 *
 * The kit stripe down the left is the same colour this team's lines get in the
 * file, so the link between the key and the codes it produces is visible
 * rather than something you have to hold in your head.
 *
 * Once a club is chosen the picker folds away — a settled choice shouldn't
 * keep an empty search box on screen for the rest of the session.
 */
export default function MatchTeamSlot({
  side,
  slot,
  prefix,
  onPrefixChange,
  clash = false,
  onClear,
  children,
}: MatchTeamSlotProps): React.ReactElement {
  const prefixId = useId();
  const [changing, setChanging] = useState(false);
  const clubId = slot.club?.id;
  const isHome = side === 'home';

  // Picking a different club settles the slot again.
  useEffect(() => setChanging(false), [clubId]);

  const squadSize = slot.players.length;
  const settled = Boolean(slot.club) && !changing;

  // Show what the key actually produces, using a real player once one is loaded.
  const sample = slot.players.find((player) => player.shirtNumber) ?? slot.players[0];

  return (
    <div className={`slot ${isHome ? 'slot-home' : 'slot-away'}`}>
      <div className="slot-head">
        <span className="slot-role">{isHome ? 'Home' : 'Away'}</span>
        {!isHome && !slot.club && <span className="slot-optional">Optional</span>}
        <span className="btn-row">
          {settled && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setChanging(true)}
            >
              Change
            </button>
          )}
          {slot.club && onClear && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setChanging(false);
                onClear();
              }}
            >
              Remove
            </button>
          )}
        </span>
      </div>

      {!settled && children}

      {slot.club && (
        <>
          <div className="slot-picked">
            <span className="slot-picked-name">
              {slot.club.name}
              {slot.club.country && (
                <span className="slot-picked-country"> · {slot.club.country}</span>
              )}
            </span>
            <div className="prefix">
              <label className="field-label" htmlFor={prefixId} style={{ marginBottom: 0 }}>
                Key
              </label>
              <input
                id={prefixId}
                type="text"
                className="prefix-input"
                value={prefix}
                maxLength={1}
                aria-invalid={clash}
                aria-describedby={clash ? `${prefixId}-err` : undefined}
                onChange={(e) => onPrefixChange(e.target.value.slice(0, 1).toLowerCase())}
              />
            </div>
          </div>

          {clash ? (
            <p className="field-error" id={`${prefixId}-err`}>
              Both teams are set to “{prefix}”. Give each team its own key so the codes
              don&rsquo;t overwrite one another.
            </p>
          ) : slot.loading ? (
            <p className="slot-status">Loading squad…</p>
          ) : squadSize > 0 ? (
            <p className="prefix-example">
              Type <b>{prefix || '?'}{sample?.shirtNumber ?? '1'}</b> for {sample?.name} ·{' '}
              {squadSize} players
            </p>
          ) : (
            <p className="slot-status">No squad data came back for this club.</p>
          )}
        </>
      )}
    </div>
  );
}
