// src/pages/HomeFeed.jsx
// Home / Live Scores Feed — main page component.

import { useState, useMemo, useEffect } from 'react';
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
  news,
  predictorMatches,
  coinRewardRules,
} from '../data/mockData';
import './HomeFeed.css';

const LEAGUE_MATCHDAY = {
  'Premier League':   29,
  'La Liga':          22,
  'Champions League': 6,
};

const LEAGUE_ORDER = ['Premier League', 'La Liga', 'Champions League'];

function groupMatchesByLeague(matchList) {
  const groups = {};
  for (const m of matchList) {
    if (!groups[m.league]) groups[m.league] = [];
    groups[m.league].push(m);
  }
  return groups;
}

function CenterFeed({ selectedDate, isLiveOnly, onExitLiveOnly, hasAnyLiveMatches }) {
  const grouped = useMemo(() => groupMatchesByLeague(matches), []);
  const liveMatches = useMemo(() => matches.filter((m) => m.status === 'live'), []);

  if (isLiveOnly) {
    return (
      <main className="home-feed__center">
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
                <MatchRow match={match} showLeague animationDelay={i * 35} />
              </div>
            ))}
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="home-feed__center">
      {/* Section heading + date selector */}
      <div className="home-feed__heading-row">
        <h1 className="home-feed__heading">Matches</h1>
        <DateSelector selected={selectedDate.value} onChange={selectedDate.set} />
      </div>

      {/* League groups */}
      <div className="home-feed__leagues">
        {LEAGUE_ORDER.map((league) => {
          const leagueMatches = grouped[league] ?? [];
          return (
            <LeagueGroup
              key={league}
              league={league}
              matches={leagueMatches}
              matchday={LEAGUE_MATCHDAY[league]}
            />
          );
        })}
      </div>
    </main>
  );
}

function RightPanel() {
  const featuredMatch = useMemo(
    () => matches.find((m) => m.id === 102),
    []
  );

  const activePredictor = useMemo(
    () => predictorMatches.find((pm) => pm.userPick === null) ?? predictorMatches[0],
    []
  );

  return (
    <aside className="home-feed__right">
      <MatchOfTheDayCard match={featuredMatch} />
      <PredictorCard predictorMatch={activePredictor} coinRules={coinRewardRules} />
      <NewsList newsItems={news} />
    </aside>
  );
}

export default function HomeFeed() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLiveOnly, setIsLiveOnly] = useState(false);

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
