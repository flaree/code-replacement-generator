import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Tooltip from './Tooltip';
import { useCacheInfo } from '../hooks/useCacheInfo';
import { CacheStatus } from '../services/api';
import './CacheStatusBadge.css';

/**
 * Render a duration in the coarsest unit that still reads sensibly.
 *
 * @param seconds - Age of the data
 */
const formatAge = (seconds: number): string => {
  if (seconds < 60) { return 'just now'; }
  if (seconds < 3600) { return `${Math.round(seconds / 60)}m old`; }
  if (seconds < 86400) { return `${Math.round(seconds / 3600)}h old`; }
  return `${Math.round(seconds / 86400)}d old`;
};

interface Appearance {
  label: string;
  tone: string;
  detail: string;
}

const APPEARANCE: Record<Exclude<CacheStatus, 'UNKNOWN'>, Appearance> = {
  MISS: {
    label: 'Live',
    tone: 'cache-badge-live',
    detail: 'Fetched fresh from Transfermarkt just now.',
  },
  HIT: {
    label: 'Cached',
    tone: '',
    detail:
      'Served from cache rather than scraping Transfermarkt again. Squad changes made since then will not show yet.',
  },
  STALE: {
    label: 'Stale',
    tone: 'cache-badge-stale',
    detail:
      'Transfermarkt blocked the request, so older cached data was used instead. Check squad numbers against the team sheet before relying on these codes.',
  },
};

/**
 * Show where the data on screen came from, based on the API's `X-Cache` header.
 *
 * Renders nothing until an API call has completed, or when the API reports no cache status.
 */
export default function CacheStatusBadge(): React.ReactElement | null {
  const info = useCacheInfo();
  const warnedRef = useRef(false);

  const isStale = info?.status === 'STALE';

  // Stale data means the squad on screen may predate a transfer or a shirt-number change, which is
  // worth interrupting for. Warn once per run of stale responses, not once per request.
  useEffect(() => {
    if (!isStale) {
      warnedRef.current = false;
      return;
    }
    if (warnedRef.current) { return; }
    warnedRef.current = true;
    toast('Transfermarkt is blocking requests — showing older cached data.', {
      icon: '⚠️',
      duration: 6000,
    });
  }, [isStale]);

  if (!info || info.status === 'UNKNOWN') {
    return null;
  }

  const { label, tone, detail } = APPEARANCE[info.status];
  const age = info.ageSeconds === null ? null : formatAge(info.ageSeconds);

  return (
    <Tooltip content={age ? `${detail} Data is ${age}.` : detail} position="bottom">
      <span className={`cache-badge ${tone}`.trim()}>
        <span className="cache-badge-dot" />
        {age && info.status !== 'MISS' ? `${label} · ${age}` : label}
      </span>
    </Tooltip>
  );
}
