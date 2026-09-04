// src/components/team-profile/FixturesTab.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import { renderMatchCenter, formatKickoffTime } from '../../utils/matchHelpers';
import { standings } from '../../data/mockData';
import './FixturesTab.css';

/**
 * Formats matchDateUtc to "Mon, Aug 24" or "Today, Aug 24" if match is today.
 */
function formatTierDate(dateUtc) {
  if (!dateUtc) return '—';
  const d = new Date(dateUtc);
  if (isNaN(d.getTime())) return '—';

  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = d.getDate();

  if (isToday) {
    return `Today, ${month} ${dayNum}`;
  }
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  return `${weekday}, ${month} ${dayNum}`;
}

/**
 * Formats date for Next Match display: "Sep 6"
 */
function formatNextMatchDate(dateUtc) {
  if (!dateUtc) return '';
  const d = new Date(dateUtc);
  if (isNaN(d.getTime())) return '';
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = d.getDate();
  return `${month} ${dayNum}`;
}

export default function FixturesTab({ team, matches = [], leagues = [] }) {
  const navigate = useNavigate();

  // All matches involving this team, sorted chronologically ascending
  const allMatches = useMemo(() => {
    if (!team) return [];
    return matches
      .filter((m) => m.homeTeam?.id === team.id || m.awayTeam?.id === team.id)
      .sort((a, b) => new Date(a.matchDateUtc) - new Date(b.matchDateUtc));
  }, [team, matches]);

  // Initial pageIndex opens showing the first upcoming or future match
  const initialPageIndex = useMemo(() => {
    if (allMatches.length === 0) return 0;
    const now = new Date();
    const idx = allMatches.findIndex(
      (m) => m.status === 'upcoming' || new Date(m.matchDateUtc) >= now
    );
    return idx >= 0 ? Math.floor(idx / 10) : 0;
  }, [allMatches]);

  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    setPageIndex(initialPageIndex);
    setFadeKey((k) => k + 1);
  }, [initialPageIndex]);

  const totalPages = Math.ceil(allMatches.length / 10) || 1;

  // 10 matches per page slice
  const displayedMatches = useMemo(() => {
    const start = pageIndex * 10;
    return allMatches.slice(start, start + 10);
  }, [allMatches, pageIndex]);

  // Next upcoming match for the right sidebar card
  const nextUpcomingMatch = useMemo(() => {
    const now = new Date();
    return allMatches.find(
      (m) => m.status === 'upcoming' && new Date(m.matchDateUtc) > now
    );
  }, [allMatches]);

  // Derive stats for BOTH Home and Away teams of the Next Match
  const { homeStats, awayStats } = useMemo(() => {
    if (!nextUpcomingMatch) {
      return { homeStats: null, awayStats: null };
    }

    const calcTeamStats = (tObj) => {
      if (!tObj) return { rank: '—', gpm: '—', cpm: '—' };
      const tId = tObj.id;

      // Table position lookup
      const leagueRows = standings[tObj.league ?? team?.league] ?? standings[team?.league] ?? [];
      const rankRow = leagueRows.find((r) => r.team?.id === tId);
      const position = rankRow?.position ?? rankRow?.pos ?? '—';

      // Finished matches for this team
      const finishedForTeam = matches.filter(
        (m) =>
          (m.homeTeam?.id === tId || m.awayTeam?.id === tId) &&
          m.status === 'finished'
      );

      let scored = 0;
      let conceded = 0;
      finishedForTeam.forEach((m) => {
        const isHome = m.homeTeam?.id === tId;
        scored += isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
        conceded += isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
      });

      const count = finishedForTeam.length;
      const gpm = count > 0 ? (scored / count).toFixed(2) : '—';
      const cpm = count > 0 ? (conceded / count).toFixed(2) : '—';

      return {
        rank: position,
        gpm,
        cpm,
      };
    };

    return {
      homeStats: calcTeamStats(nextUpcomingMatch.homeTeam),
      awayStats: calcTeamStats(nextUpcomingMatch.awayTeam),
    };
  }, [nextUpcomingMatch, matches, team]);

  const isPrevDisabled = pageIndex === 0;
  const isNextDisabled = pageIndex >= totalPages - 1 || totalPages === 0;

  // Next match league logo
  const nextMatchLeagueObj = useMemo(() => {
    if (!nextUpcomingMatch) return null;
    return leagues.find((l) => l.name === nextUpcomingMatch.league);
  }, [nextUpcomingMatch, leagues]);

  // Primary colors for color coding stat numbers & badges
  const homePrimaryColor = nextUpcomingMatch?.homeTeam?.primaryColor ?? '#ffffff';
  const awayPrimaryColor = nextUpcomingMatch?.awayTeam?.primaryColor ?? '#6b7280';

  return (
    <div className="fixtures-tab">
      {/* ── LEFT COLUMN: FIXTURES LIST CARD (~65% flex: 1.8) ─────────────── */}
      <div className="fixtures-tab__main">
        <div className="fixtures-card">
          {/* Card Header with pagination controls */}
          <div className="fixtures-card__header">
            <button
              type="button"
              className={`fixtures-card__nav-btn ${
                isPrevDisabled ? 'fixtures-card__nav-btn--disabled' : ''
              }`}
              onClick={() => {
                setPageIndex((p) => Math.max(0, p - 1));
                setFadeKey((k) => k + 1);
              }}
              disabled={isPrevDisabled}
              aria-label="Previous page of fixtures"
            >
              ‹
            </button>
            <h2 className="fixtures-card__title">Fixtures</h2>
            <button
              type="button"
              className={`fixtures-card__nav-btn ${
                isNextDisabled ? 'fixtures-card__nav-btn--disabled' : ''
              }`}
              onClick={() => {
                setPageIndex((p) => Math.min(totalPages - 1, p + 1));
                setFadeKey((k) => k + 1);
              }}
              disabled={isNextDisabled}
              aria-label="Next page of fixtures"
            >
              ›
            </button>
          </div>

          {/* Matches List Container with fade animation key */}
          <div key={fadeKey} className="fixtures-page-content">
            {displayedMatches.length === 0 ? (
              <div className="fixtures-card__empty">No fixtures found for this team</div>
            ) : (
              displayedMatches.map((m, index) => {
                const leagueObj = leagues.find((l) => l.name === m.league);

                return (
                  <div
                    key={m.id}
                    className="fixture-match-group"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    {/* TIER 1: Date + League */}
                    <div className="fixture-tier1">
                      <span className="fixture-tier1__date">
                        {formatTierDate(m.matchDateUtc)}
                      </span>
                      <div className="fixture-tier1__league">
                        <span className="fixture-tier1__league-name">
                          {m.league}
                        </span>
                        {leagueObj?.logoUrl && (
                          <img
                            src={leagueObj.logoUrl}
                            alt=""
                            width="16"
                            height="16"
                            className="fixture-tier1__league-logo"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* TIER 2: Match Row (home | center | away) */}
                    <div
                      className="fixture-tier2"
                      onClick={() => navigate(`/matches/${m.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/matches/${m.id}`);
                        }
                      }}
                    >
                      {/* Left: Home Team */}
                      <div className="fixture-tier2__home">
                        <Crest
                          logoUrl={m.homeTeam?.logoUrl}
                          name={m.homeTeam?.name}
                          size={32}
                        />
                        <span className="fixture-tier2__name">
                          {m.homeTeam?.name}
                        </span>
                      </div>

                      {/* Center: Score / Time badge */}
                      <div className="fixture-tier2__center">
                        {renderMatchCenter(m, team?.id)}
                      </div>

                      {/* Right: Away Team */}
                      <div className="fixture-tier2__away">
                        <span className="fixture-tier2__name">
                          {m.awayTeam?.name}
                        </span>
                        <Crest
                          logoUrl={m.awayTeam?.logoUrl}
                          name={m.awayTeam?.name}
                          size={32}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: NEXT MATCH CARD (~35% flex: 1, sticky) ────────── */}
      <aside className="fixtures-tab__sidebar">
        {nextUpcomingMatch && homeStats && awayStats && (
          <div className="next-match-card">
            {/* Header */}
            <div className="next-match-card__header">
              <span className="next-match-card__header-title">Next match</span>
              <div className="next-match-card__header-league">
                <span className="next-match-card__league-name">
                  {nextUpcomingMatch.league}
                </span>
                {nextMatchLeagueObj?.logoUrl && (
                  <img
                    src={nextMatchLeagueObj.logoUrl}
                    alt=""
                    width="16"
                    height="16"
                    className="next-match-card__league-logo"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>

            {/* Clickable Match Row Area */}
            <div
              className="next-match-clickable"
              onClick={() => navigate(`/matches/${nextUpcomingMatch.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/matches/${nextUpcomingMatch.id}`);
                }
              }}
            >
              {/* Home Team */}
              <div className="next-match-card__team">
                <Crest
                  logoUrl={nextUpcomingMatch.homeTeam?.logoUrl}
                  name={nextUpcomingMatch.homeTeam?.name}
                  size={52}
                />
                <span className="next-match-card__team-name">
                  {nextUpcomingMatch.homeTeam?.name}
                </span>
              </div>

              {/* Center Kickoff */}
              <div className="next-match-card__center">
                <span className="next-match-card__time">
                  {formatKickoffTime(nextUpcomingMatch.matchDateUtc)}
                </span>
                <span className="next-match-card__date">
                  {formatNextMatchDate(nextUpcomingMatch.matchDateUtc)}
                </span>
              </div>

              {/* Away Team */}
              <div className="next-match-card__team">
                <Crest
                  logoUrl={nextUpcomingMatch.awayTeam?.logoUrl}
                  name={nextUpcomingMatch.awayTeam?.name}
                  size={52}
                />
                <span className="next-match-card__team-name">
                  {nextUpcomingMatch.awayTeam?.name}
                </span>
              </div>
            </div>

            {/* Stats Rows (Directly after divider with no team label header) */}
            <div className="next-match-card__stats">
              {/* Row 1: Table position */}
              <div className="next-match-stat-row">
                <span
                  className="next-match-stat-row__value"
                  style={{ color: homePrimaryColor }}
                >
                  {homeStats.rank}
                </span>
                <span className="next-match-stat-row__label">Table position</span>
                <div className="next-match-stat-row__right">
                  <span
                    className="next-match-stat-row__badge"
                    style={{ backgroundColor: awayPrimaryColor }}
                  >
                    {awayStats.rank}
                  </span>
                </div>
              </div>

              {/* Row 2: Goals per match */}
              <div className="next-match-stat-row">
                <span
                  className="next-match-stat-row__value"
                  style={{ color: homePrimaryColor }}
                >
                  {homeStats.gpm}
                </span>
                <span className="next-match-stat-row__label">Goals per match</span>
                <div className="next-match-stat-row__right">
                  <span
                    className="next-match-stat-row__badge"
                    style={{ backgroundColor: awayPrimaryColor }}
                  >
                    {awayStats.gpm}
                  </span>
                </div>
              </div>

              {/* Row 3: Goals conceded per match */}
              <div className="next-match-stat-row">
                <span
                  className="next-match-stat-row__value"
                  style={{ color: homePrimaryColor }}
                >
                  {homeStats.cpm}
                </span>
                <span className="next-match-stat-row__label">Goals conceded per match</span>
                <div className="next-match-stat-row__right">
                  <span
                    className="next-match-stat-row__badge"
                    style={{ backgroundColor: awayPrimaryColor }}
                  >
                    {awayStats.cpm}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
