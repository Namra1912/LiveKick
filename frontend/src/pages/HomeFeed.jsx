// src/pages/HomeFeed.jsx
// Home / Live Scores Feed — main page component.

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import DateSelector from '../components/feed/DateSelector';
import LeagueGroup from '../components/feed/LeagueGroup';
import MatchOfTheDayCard from '../components/panels/MatchOfTheDayCard';
import PredictorCard from '../components/panels/PredictorCard';
import NewsList from '../components/panels/NewsList';
import SearchModal from '../components/search/SearchModal';
import MatchRow from '../components/feed/MatchRow';
import {
  matches,
  leagues,
  news,
  predictorMatches,
  coinRewardRules,
  currentUser,
} from '../data/mockData';

import './HomeFeed.css';
import { useLenisScroll } from '../hooks/useLenisScroll';

const LEAGUE_MATCHDAY = {
  'Premier League': 29,
  'La Liga': 22,
  'Champions League': 6,
  'Bundesliga': 20,
  'Serie A': 23,
};

const LEAGUE_ORDER = [
  'Premier League',
  'La Liga',
  'Champions League',
  'Bundesliga',
  'Serie A',
];

// TASK C — lookup map so we can pass the full league object (with logoUrl) to LeagueGroup
const leaguesByName = Object.fromEntries(leagues.map((l) => [l.name, l]));


const LS_KEY = 'lk_fav_matches';

/**
 * Resolves selectedDate.value into a Date object at local midnight (00:00:00.000).
 * Handles:
 *  - 'today': anchor mock date (2026-08-01) at local midnight
 *  - 'yesterday': anchor date - 1 day (2026-07-31)
 *  - 'tomorrow': anchor date + 1 day (2026-08-02)
 *  - ISO date string like '2026-08-05': parsed directly into local midnight Date
 */
function getTargetDate(dateVal) {
  const baseToday = new Date(); // Current local date (e.g. 2026-08-04)
  baseToday.setHours(0, 0, 0, 0);

  if (dateVal === 'today') {
    return baseToday;
  }
  if (dateVal === 'yesterday') {
    const d = new Date(baseToday);
    d.setDate(d.getDate() - 1);
    return d;
  }
  if (dateVal === 'tomorrow') {
    const d = new Date(baseToday);
    d.setDate(d.getDate() + 1);
    return d;
  }
  if (typeof dateVal === 'string' && dateVal.includes('-')) {
    const [y, m, d] = dateVal.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  }
  return baseToday;
}

/**
 * Checks whether a match's UTC date string falls on the same LOCAL calendar date
 * as the target Date object.
 */
function isSameLocalDate(matchDateUtc, targetDate) {
  if (!matchDateUtc || !targetDate) return false;
  const matchDate = new Date(matchDateUtc);
  return (
    matchDate.getUTCFullYear() === targetDate.getFullYear() &&
    matchDate.getUTCMonth() === targetDate.getMonth() &&
    matchDate.getUTCDate() === targetDate.getDate()
  );
}

function groupMatchesByLeague(matchList) {
  const groups = {};
  for (const m of matchList) {
    if (!groups[m.league]) groups[m.league] = [];
    groups[m.league].push(m);
  }
  return groups;
}

function CenterFeed({ selectedDate, isLiveOnly, onExitLiveOnly, hasAnyLiveMatches, favMatchIds, toggleFav }) {
  // Smooth scroll for .home-feed__center — the main match feed column.
  // Scoped to this element only — never window/document.
  const centerRef = useRef(null);
  const centerContentRef = useRef(null);
  useLenisScroll(centerRef, centerContentRef);

  // Filter matches by selected calendar date BEFORE grouping by league
  const grouped = useMemo(() => {
    const targetDate = getTargetDate(selectedDate.value);
    const filteredMatches = matches.filter((m) => isSameLocalDate(m.matchDateUtc, targetDate));
    return groupMatchesByLeague(filteredMatches);
  }, [selectedDate.value]);

  const liveMatches = useMemo(() => matches.filter((m) => m.status === 'live'), []);

  if (isLiveOnly) {
    return (
      <main className="home-feed__center" ref={centerRef}>
        <div className="home-feed__center-content" ref={centerContentRef}>
          {/* Live Filter Header */}
          <div className="home-feed__heading-row">
            <div className="home-feed__live-title-wrap">
              <span className={`live-dot${hasAnyLiveMatches ? '' : ' live-dot--static'}`} aria-hidden="true" />
              <h1 className="home-feed__heading">Live Matches</h1>
              <span className="home-feed__live-count">({liveMatches.length})</span>
            </div>
            <button className="home-feed__exit-btn" onClick={onExitLiveOnly}>
              Exit Live View ×
            </button>
          </div>

          {/* Live filtered content */}
          {liveMatches.length === 0 ? (
            <div className="home-feed__live-empty">
              <span className="live-dot live-dot--static" aria-hidden="true" />
              <h3 className="home-feed__empty-title">No live matches right now</h3>
              <p className="home-feed__empty-desc">
                Check back later or return to Today&apos;s full match schedule.
              </p>
              <button className="home-feed__exit-btn home-feed__exit-btn--cta" onClick={onExitLiveOnly}>
                View Today&apos;s Schedule
              </button>
            </div>
          ) : (
            <div className="home-feed__live-list">
              {liveMatches.map((match, i) => (
                <div key={match.id} className={i > 0 ? 'league-group__row-divider' : ''}>
                  <MatchRow
                    match={match}
                    showLeague
                    animationDelay={i * 35}
                    isFavorited={favMatchIds.has(match.id)}
                    onToggleFav={toggleFav}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="home-feed__center" ref={centerRef}>
      <div className="home-feed__center-content" ref={centerContentRef}>
        {/* Section heading + date selector */}
        <div className="home-feed__heading-row">
          <h1 className="home-feed__heading">Matches</h1>
          <DateSelector selected={selectedDate.value} onChange={selectedDate.set} />
        </div>

        {/* League groups */}
        <div className="home-feed__leagues">
          {(() => {
            const dateLabel =
              selectedDate.value === 'today'     ? 'today' :
              selectedDate.value === 'yesterday' ? 'yesterday' :
              selectedDate.value === 'tomorrow'  ? 'tomorrow' :
              'on this date';

            return LEAGUE_ORDER.map((leagueName) => {
              const leagueMatches = grouped[leagueName] ?? [];
              const leagueObj = leaguesByName[leagueName] ?? { name: leagueName, logoUrl: null };
              return (
                <LeagueGroup
                  key={`${leagueName}-${selectedDate.value}`}
                  league={leagueObj}
                  matches={leagueMatches}
                  matchday={LEAGUE_MATCHDAY[leagueName]}
                  favMatchIds={favMatchIds}
                  onToggleFav={toggleFav}
                  dateLabel={dateLabel}
                />
              );
            });

          })()}
        </div>
      </div>
    </main>
  );
}

function RightPanel() {
  // Smooth scroll for .home-feed__right — the right panel (MOTD, Predictor, News).
  // Scoped to this element only — never window/document.
  const rightRef = useRef(null);
  const rightContentRef = useRef(null);
  useLenisScroll(rightRef, rightContentRef);

  const featuredMatch = useMemo(
    () => matches.find((m) => m.id === 102),
    []
  );

  const activePredictor = useMemo(
    () => predictorMatches.find((pm) => pm.userPick === null) ?? predictorMatches[0],
    []
  );

  return (
    <aside className="home-feed__right" ref={rightRef}>
      <div className="home-feed__right-content" ref={rightContentRef}>
        <MatchOfTheDayCard match={featuredMatch} />
        <PredictorCard predictorMatch={activePredictor} userBalance={currentUser.matchdayCoins} />
        <NewsList newsItems={news} />
      </div>
    </aside>
  );
}

export default function HomeFeed() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLiveOnly, setIsLiveOnly] = useState(false);

  // ---------------------------------------------------------------------------
  // Persistent favorites — single source of truth for the whole feed
  // ---------------------------------------------------------------------------
  const [favMatchIds, setFavMatchIds] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Write to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify([...favMatchIds]));
    } catch {
      // Ignore storage errors (private mode / quota exceeded)
    }
  }, [favMatchIds]);

  const toggleFav = useCallback((matchId) => {
    setFavMatchIds((prev) => {
      const next = new Set(prev);
      next.has(matchId) ? next.delete(matchId) : next.add(matchId);
      return next;
    });
  }, []);

  const hasAnyLiveMatches = useMemo(
    () => matches.some((m) => m.status === 'live'),
    []
  );

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <AppLayout
        onSearchOpen={() => setIsSearchOpen(true)}
        isLiveOnly={isLiveOnly}
        onToggleLiveOnly={() => setIsLiveOnly((prev) => !prev)}
        hasAnyLiveMatches={hasAnyLiveMatches}
      >
        <CenterFeed
          selectedDate={{
            value: selectedDate,
            set: (val) => {
              setSelectedDate(val);
              setIsLiveOnly(false);
            },
          }}
          isLiveOnly={isLiveOnly}
          onExitLiveOnly={() => setIsLiveOnly(false)}
          hasAnyLiveMatches={hasAnyLiveMatches}
          favMatchIds={favMatchIds}
          toggleFav={toggleFav}
        />
        <RightPanel />
      </AppLayout>

      {/* Search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
