import React, { useMemo } from 'react';
import CopyButton from './CopyButton';
import CacheStatusBadge from './CacheStatusBadge';
import { downloadTextFile } from '../utils/helpers';
import { NameCodePosition } from '../constants/config';

type LineKind = 'blank' | 'entry' | 'raw';
type Side = 'home' | 'away' | null;

interface Line {
  kind: LineKind;
  code: string;
  text: string;
  side: Side;
}

/**
 * Split a code replacement file into its parts.
 *
 * The file format is `code<TAB>description`, one per line, with blank lines
 * separating blocks. Which team a line belongs to is carried by its key
 * (after the name-only mark is stripped off, if present), so that is how
 * each line gets its kit colour. Keys can be one or two characters, so this
 * checks the longer of the two team keys first — if one key happens to be a
 * prefix of the other, the more specific match wins.
 */
const parseLines = (
  code: string,
  homePrefix: string,
  awayPrefix: string,
  namePrefix: string,
  namePosition: NameCodePosition
): Line[] => {
  const sideOf = (raw: string): Side => {
    let stripped = raw;
    if (namePrefix) {
      if (namePosition === 'suffix' && raw.endsWith(namePrefix)) {
        stripped = raw.slice(0, raw.length - namePrefix.length);
      } else if (namePosition === 'prefix' && raw.startsWith(namePrefix)) {
        stripped = raw.slice(namePrefix.length);
      }
    }
    if (!stripped) {
      return null;
    }
    const bySize = [
      { side: 'home' as const, prefix: homePrefix },
      { side: 'away' as const, prefix: awayPrefix },
    ]
      .filter((entry) => entry.prefix)
      .sort((a, b) => b.prefix.length - a.prefix.length);

    return bySize.find((entry) => stripped.startsWith(entry.prefix))?.side ?? null;
  };

  return code.split('\n').map((line) => {
    if (!line.trim()) {
      return { kind: 'blank' as const, code: '', text: '', side: null };
    }
    const tab = line.indexOf('\t');
    if (tab === -1) {
      return { kind: 'raw' as const, code: '', text: line, side: null };
    }
    const codeCell = line.slice(0, tab);
    return {
      kind: 'entry' as const,
      code: codeCell,
      text: line.slice(tab + 1),
      side: sideOf(codeCell),
    };
  });
};

/** Caption-column widths for the empty file, in px. A 0 marks a blank line. */
const GHOST_ROWS = [260, 190, 300, 0, 215, 275, 165, 240, 0, 265, 200, 285, 175, 250];

interface CodeLedgerProps {
  code: string;
  homePrefix: string;
  awayPrefix: string;
  /** Mark stripped off a code before reading its team letter, e.g. the "." in ".b1". */
  namePrefix?: string;
  /** Whether that mark sits before the key (".b1") or after it ("b1."). */
  namePosition?: NameCodePosition;
  /** Filename used for the download, without extension. */
  filename: string;
  /** True while a squad is still being fetched. */
  busy?: boolean;
  /** Re-animates the file when this changes — i.e. when a squad lands. */
  generation: string;
  emptyTitle: string;
  emptyText: string;
  /** Shown in place of the empty state while `busy` is true. */
  busyTitle?: string;
  busyText?: string;
}

/**
 * The file being produced, shown while it is being produced.
 *
 * Codes sit in their own column with the tab stop drawn as a rule, so what is
 * on screen has the same shape as the text file that lands in Photo Mechanic.
 */
export default function CodeLedger({
  code,
  homePrefix,
  awayPrefix,
  namePrefix: rawNamePrefix = '.',
  namePosition = 'prefix',
  filename,
  busy = false,
  generation,
  emptyTitle,
  emptyText,
  busyTitle = 'Loading squad',
  busyText = 'Pulling the squad list from Transfermarkt.',
}: CodeLedgerProps): React.ReactElement {
  // Matches the generator's own fallback for a cleared mark field.
  const namePrefix = rawNamePrefix || '.';
  const lines = useMemo(
    () => parseLines(code, homePrefix, awayPrefix, namePrefix, namePosition),
    [code, homePrefix, awayPrefix, namePrefix, namePosition]
  );

  const codeCount = useMemo(
    () => lines.filter((line) => line.kind === 'entry').length,
    [lines]
  );

  const hasCode = code.trim().length > 0;

  return (
    <section className="panel ledger" aria-label="Code replacements">
      <div className="panel-head">
        <h2 className="panel-title">Code replacements</h2>
        <div className="panel-head-meta">
          <CacheStatusBadge />
          {hasCode && (
            <span className="ledger-count">
              {codeCount} {codeCount === 1 ? 'code' : 'codes'}
            </span>
          )}
        </div>
      </div>

      <div className="ledger-body">
        {hasCode ? (
          <div key={generation} className="ledger-group">
            {lines.map((line, index) => (
              <div
                // A line in a text file is identified by its position in the
                // file, so the index is the correct identity here.
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={[
                  'ledger-line',
                  line.kind === 'blank' ? 'ledger-line-blank' : '',
                  line.side === null && line.kind === 'entry' ? 'ledger-line-meta' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={
                  line.side
                    ? ({
                        ['--kit' as string]:
                          line.side === 'home' ? 'var(--home)' : 'var(--away)',
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <span className="ledger-line-kit" aria-hidden="true" />
                <span className="ledger-line-code">{line.code}</span>
                <span className="ledger-line-text">{line.text}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="ledger-empty">
            {/* The file's own shape, drawn empty — a code column, a tab stop,
                and a caption column waiting to be filled. */}
            <div className="ledger-ghost" aria-hidden="true">
              {GHOST_ROWS.map((width, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="ledger-line" key={index}>
                  <span className="ledger-line-kit" />
                  <span className="ledger-line-code">
                    <i className="ledger-ghost-bar" style={{ width: index % 4 === 3 ? 0 : 22 }} />
                  </span>
                  <span className="ledger-line-text">
                    <i className="ledger-ghost-bar" style={{ width }} />
                  </span>
                </div>
              ))}
            </div>
            <div className="ledger-empty-message">
              <p className="ledger-empty-title">{busy ? busyTitle : emptyTitle}</p>
              <p className="ledger-empty-text">{busy ? busyText : emptyText}</p>
            </div>
          </div>
        )}
      </div>

      {hasCode && (
        <div className="panel-foot">
          <CopyButton text={code} label="Copy file" />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => downloadTextFile(code, `${filename}.txt`)}
          >
            Download .txt
          </button>
          <span className="field-hint" style={{ marginTop: 0, marginLeft: 'auto' }}>
            Photo Mechanic: Edit &rsaquo; Settings &rsaquo; Code Replacements
          </span>
        </div>
      )}
    </section>
  );
}
