// src/utils/matchHelpers.jsx
import React from 'react';

/**
 * Formats matchDateUtc to 12-hour kickoff time "7:45 PM".
 */
export function formatKickoffTime(dateUtc) {
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
 * Determines W/L/D result from the perspective of teamId.
 */
export function getTeamResult(match, teamId) {
  if (!match || !teamId) return 'W';
  const isHome = match.homeTeam?.id === teamId;
  const teamScore = isHome ? match.homeScore : match.awayScore;
  const oppScore = isHome ? match.awayScore : match.homeScore;

  if (teamScore > oppScore) return 'W';
  if (teamScore < oppScore) return 'L';
  return 'D';
}

/**
 * Shared center-cell renderer for match rows across FixturesTab and FixtureDifficultyCard.
 * - Finished: Win (green), Loss (red), Draw (grey) tinted pill without letter
 * - Live: Red score pill with pulsing dot
 * - Upcoming: Green kickoff time
 */
export function renderMatchCenter(match, teamId) {
  if (!match) return null;

  if (match.status === 'finished') {
    const result = teamId ? getTeamResult(match, teamId) : 'W';
    const resultClass =
      result === 'W'
        ? 'match-score-pill--win'
        : result === 'L'
        ? 'match-score-pill--loss'
        : 'match-score-pill--draw';

    return (
      <span className={`match-score-pill match-score-pill--finished ${resultClass}`}>
        {match.homeScore} - {match.awayScore}
      </span>
    );
  }

  if (match.status === 'live') {
    return (
      <span className="match-score-pill match-score-pill--live">
        <span className="match-score-pill__live-dot" aria-hidden="true" />
        {match.homeScore} - {match.awayScore}
      </span>
    );
  }

  // Default: upcoming
  return (
    <span className="match-kickoff-time">
      {formatKickoffTime(match.matchDateUtc)}
    </span>
  );
}
