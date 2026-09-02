// src/components/team-profile/FixtureDifficultyCard.jsx
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import { matches, standings, leagues } from '../../data/mockData';
import './FixtureDifficultyCard.css';

/**
 * Formats matchDateUtc to "Mon, Sep 8" or "Today, Sep 2" if match is today.
 */
function formatFixtureDate(dateUtc) {
  if (!dateUtc) return '—';
  const d = new Date(dateUtc);
  if (isNaN(d.getTime())) return '—';

  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const dayNum = d.getDate();

  if (isToday) {
    return `Today, ${month} ${dayNum}`;
  }
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'short' });
  return `${weekday}, ${month} ${dayNum}`;
}

/**
 * Formats matchDateUtc to 12-hour kickoff time "7:45 PM".
 */
function formatKickoffTime(dateUtc) {
  if (!dateUtc) return 'TBD';
  const d = new Date(dateUtc);
  if (isNaN(d.getTime())) return 'TBD';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats date for tooltip: "Sep 17: Racing Santander (Home)"
 */
function getTooltipString(dateUtc, opponentName, isHome) {
  const venueStr = isHome ? 'Home' : 'Away';
  if (!dateUtc) return `${opponentName} (${venueStr})`;

  const d = new Date(dateUtc);
  if (isNaN(d.getTime())) return `${opponentName} (${venueStr})`;

  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  return `${month} ${day}: ${opponentName} (${venueStr})`;
}

/**
 * Derives difficulty level from opponent's standings rank:
 * Rank 1–6 = hard, 7–13 = moderate, 14–20 = easy
 */
function getDifficultyLevel(opponentId, leagueStandings) {
  if (!opponentId || !leagueStandings || leagueStandings.length === 0) {
    return 'moderate';
  }
  const rankIndex = leagueStandings.findIndex((r) => r.team?.id === opponentId);
  const rank = rankIndex >= 0 ? rankIndex + 1 : 10;

  if (rank >= 1 && rank <= 6) return 'hard';
  if (rank >= 7 && rank <= 13) return 'moderate';
  return 'easy';
}

export default function FixtureDifficultyCard({ team }) {
  const navigate = useNavigate();

  // All matches for this team sorted by matchDateUtc
  const allMatches = useMemo(() => {
    if (!team) return [];
    return matches
      .filter(
        (m) =>
          m.homeTeam?.id === team.id || m.awayTeam?.id === team.id
      )
      .sort((a, b) => new Date(a.matchDateUtc) - new Date(b.matchDateUtc));
  }, [team]);

  // Upcoming matches for difficulty calculations
  const upcomingMatches = useMemo(() => {
    return allMatches.filter((m) => m.status === 'upcoming');
  }, [allMatches]);

  // Initial pageOffset starts at the index of the first upcoming match
  const initialOffset = useMemo(() => {
    const idx = allMatches.findIndex((m) => m.status === 'upcoming');
    return idx >= 0 ? idx : 0;
  }, [allMatches]);

  const [pageOffset, setPageOffset] = useState(initialOffset);

  // Reset page offset if team changes
  useEffect(() => {
    setPageOffset(initialOffset);
  }, [initialOffset]);

  // Slice of 5 matches for display
  const displayedMatches = useMemo(() => {
    return allMatches.slice(pageOffset, pageOffset + 5);
  }, [allMatches, pageOffset]);

  // Group consecutive displayed matches by calendar date label
  const dateGroups = useMemo(() => {
    const groups = [];
    displayedMatches.forEach((m) => {
      const dateLabel = formatFixtureDate(m.matchDateUtc);
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.dateLabel === dateLabel) {
        lastGroup.matches.push(m);
      } else {
        const leagueObj = leagues.find((l) => l.name === m.league);
        groups.push({
          dateLabel,
          leagueName: m.league,
          leagueLogoUrl: leagueObj?.logoUrl,
          matches: [m],
        });
      }
    });
    return groups;
  }, [displayedMatches]);

  // SECTION 1: Difficulty items (next 3 upcoming opponents) & overall summary
  const { difficultyItems, overallWord, overallColor } = useMemo(() => {
    const nextThree = upcomingMatches.slice(0, 3);
    const leagueRows = standings[team?.league] ?? [];

    let hardCount = 0;
    let easyCount = 0;

    const items = nextThree.map((m) => {
      const isHome = m.homeTeam?.id === team.id;
      const opponent = isHome ? m.awayTeam : m.homeTeam;

      const diff = getDifficultyLevel(opponent?.id, leagueRows);
      if (diff === 'hard') hardCount += 1;
      if (diff === 'easy') easyCount += 1;

      const tooltipText = getTooltipString(
        m.matchDateUtc,
        opponent?.name ?? 'Opponent',
        isHome
      );

      return {
        matchId: m.id,
        opponent,
        isHome,
        diff,
        accentClass: `diff-chip--${diff}`,
        tooltipText,
      };
    });

    let word = 'Manageable';
    let color = 'var(--color-pitch-green, #00B370)';

    if (hardCount >= 2) {
      word = 'Hard';
      color = '#f87171';
    } else if (easyCount >= 2) {
      word = 'Easy';
      color = 'var(--color-pitch-green, #00B370)';
    }

    return { difficultyItems: items, overallWord: word, overallColor: color };
  }, [upcomingMatches, team]);

  const handlePrevPage = () => {
    setPageOffset((prev) => Math.max(0, prev - 5));
  };

  const handleNextPage = () => {
    setPageOffset((prev) => Math.min(Math.max(0, allMatches.length - 5), prev + 5));
  };

  const isPrevDisabled = pageOffset === 0;
  const isNextDisabled = pageOffset >= Math.max(0, allMatches.length - 5);

  return (
    <div className="fixture-card-group">
      {/* ── SECTION 1 — FIXTURE DIFFICULTY CARD ─────────────────────────── */}
      <div className="fixture-diff-card">
        <div className="fixture-diff-card__header">
          <div className="fixture-diff-card__header-left">
            <span className="fixture-diff-card__icon" aria-hidden="true">
              ⚡
            </span>
            <span className="fixture-diff-card__title">Fixture Difficulty</span>
          </div>
          <div className="fixture-diff-card__header-right">
            <span className="fixture-diff-card__next-label">Next 3</span>
            <span
              className="fixture-diff-card__summary-word"
              style={{ color: overallColor }}
            >
              {overallWord}
            </span>
          </div>
        </div>

        <div className="fixture-diff-card__chips">
          {difficultyItems.length === 0 ? (
            <div className="fixture-diff-card__empty">No upcoming opponents</div>
          ) : (
            difficultyItems.map((item, index) => (
              <div
                key={item.matchId}
                className={`fixture-diff-chip ${item.accentClass}`}
                data-tooltip={item.tooltipText}
                onClick={() => navigate(`/match/${item.matchId}`)}
                style={{ animationDelay: `${index * 60}ms` }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/match/${item.matchId}`);
                  }
                }}
              >
                <Crest
                  logoUrl={item.opponent?.logoUrl}
                  name={item.opponent?.name}
                  size={32}
                />
                <div className="fixture-diff-chip__info">
                  <span className="fixture-diff-chip__shortname">
                    {item.opponent?.shortName ??
                      item.opponent?.name?.substring(0, 3).toUpperCase()}
                  </span>
                  <span className="fixture-diff-chip__venue">
                    {item.isHome ? 'HOME' : 'AWAY'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── SECTION 2 — FIXTURES CARD ────────────────────────────────────── */}
      <div className="upcoming-fixtures-card">
        <div className="upcoming-fixtures-card__header">
          <button
            type="button"
            className={`upcoming-fixtures-card__nav-btn ${
              isPrevDisabled ? 'upcoming-fixtures-card__nav-btn--disabled' : ''
            }`}
            onClick={handlePrevPage}
            disabled={isPrevDisabled}
            aria-label="Previous 5 fixtures"
          >
            ‹
          </button>
          <span className="upcoming-fixtures-card__title">Fixtures</span>
          <button
            type="button"
            className={`upcoming-fixtures-card__nav-btn ${
              isNextDisabled ? 'upcoming-fixtures-card__nav-btn--disabled' : ''
            }`}
            onClick={handleNextPage}
            disabled={isNextDisabled}
            aria-label="Next 5 fixtures"
          >
            ›
          </button>
        </div>

        <div className="upcoming-fixtures-card__list">
          {displayedMatches.length === 0 ? (
            <div className="upcoming-fixtures-card__empty">No fixtures found</div>
          ) : (
            dateGroups.map((group, groupIdx) => (
              <div key={group.dateLabel + groupIdx} className="upcoming-fixture-group">
                {/* Date Header Tier (rendered ONCE per unique date) */}
                <div className="upcoming-fixture-tier1">
                  <span className="upcoming-fixture-tier1__date">
                    {group.dateLabel}
                  </span>
                  <div className="upcoming-fixture-tier1__league">
                    <span className="upcoming-fixture-tier1__league-name">
                      {group.leagueName}
                    </span>
                    {group.leagueLogoUrl && (
                      <img
                        src={group.leagueLogoUrl}
                        alt=""
                        width="16"
                        height="16"
                        className="upcoming-fixture-tier1__league-logo"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Match Rows under this date group */}
                {group.matches.map((m, matchIdx) => (
                  <div
                    key={m.id}
                    className="upcoming-fixture-row"
                    onClick={() => navigate(`/match/${m.id}`)}
                    style={{ animationDelay: `${(groupIdx * 2 + matchIdx) * 70}ms` }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/match/${m.id}`);
                      }
                    }}
                  >
                    <div className="upcoming-fixture-tier2__home">
                      <Crest
                        logoUrl={m.homeTeam?.logoUrl}
                        name={m.homeTeam?.name}
                        size={28}
                      />
                      <span className="upcoming-fixture-tier2__name">
                        {m.homeTeam?.name}
                      </span>
                    </div>

                    <div className="upcoming-fixture-tier2__time">
                      {formatKickoffTime(m.matchDateUtc)}
                    </div>

                    <div className="upcoming-fixture-tier2__away">
                      <span className="upcoming-fixture-tier2__name">
                        {m.awayTeam?.name}
                      </span>
                      <Crest
                        logoUrl={m.awayTeam?.logoUrl}
                        name={m.awayTeam?.name}
                        size={28}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
