// src/components/match/MatchPlayerStatsTable.jsx
// A single combined, rating-sorted player list for both sides — the one
// piece of fotmob's Stats tab worth building here: a real per-player
// breakdown (rating, minutes, goals, assists) rather than just team
// aggregates. Minutes and goal/assist counts are derived from the same
// matchEvents used everywhere else on the page, not invented separately.
import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import { squads, matchEvents } from '../../data/mockData';
import './MatchPlayerStatsTable.css';

function buildTeamRows(team, matchId, matchStatus, matchMinute) {
  const squad = squads[team?.id] ?? [];
  const startingIds = new Set(team?.lastMatchXI ?? []);
  const events = matchEvents[matchId] ?? [];

  const subOffMinute = new Map();
  const subOnMinute = new Map();
  events.forEach((e) => {
    if (e.type !== 'sub') return;
    subOffMinute.set(e.playerOff, e.minute);
    subOnMinute.set(e.playerOn, e.minute);
  });

  const fullTimeMinute = matchStatus === 'live' ? matchMinute : 90;
  const goalCount = new Map();
  const assistCount = new Map();
  events.forEach((e) => {
    if (e.type !== 'goal') return;
    if (e.player) goalCount.set(e.player, (goalCount.get(e.player) ?? 0) + 1);
    if (e.assist) assistCount.set(e.assist, (assistCount.get(e.assist) ?? 0) + 1);
  });

  const rows = [];
  squad.forEach((p) => {
    if (p.isCoach) return;
    const isStarter = startingIds.has(p.id);
    const cameOn = subOnMinute.get(p.name);
    if (!isStarter && cameOn == null) return; // unused sub — not part of the player stats table

    const minutesPlayed = isStarter
      ? (subOffMinute.get(p.name) ?? fullTimeMinute)
      : Math.max(0, fullTimeMinute - cameOn);

    rows.push({
      id: p.id,
      name: p.name,
      team,
      rating: p.rating,
      minutesPlayed,
      goals: goalCount.get(p.name) ?? 0,
      assists: assistCount.get(p.name) ?? 0,
    });
  });
  return rows;
}

export default function MatchPlayerStatsTable({ homeTeam, awayTeam, matchId, matchStatus, matchMinute }) {
  const rows = [
    ...buildTeamRows(homeTeam, matchId, matchStatus, matchMinute),
    ...buildTeamRows(awayTeam, matchId, matchStatus, matchMinute),
  ].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  if (rows.length === 0) return null;

  const navigate = useNavigate();

  return (
    <div className="match-player-stats">
      <h2 className="match-detail__card-title">Player Ratings</h2>
      <div className="match-player-stats__head">
        <span className="match-player-stats__head-player">Player</span>
        <span>Rating</span>
        <span>Min</span>
        <span>G</span>
        <span>A</span>
      </div>
      <div className="match-player-stats__rows">
        {rows.map((row) => (
          <button
            type="button"
            key={row.id}
            className="match-player-stats__row"
            onClick={() => navigate(`/players/${row.id}`)}
          >
            <span className="match-player-stats__player">
              <Crest logoUrl={row.team.logoUrl} name={row.team.name} size={16} />
              {row.name}
            </span>
            <span className={`match-player-stats__rating ${row.rating >= 8 ? 'match-player-stats__rating--high' : ''}`}>
              {row.rating != null ? row.rating.toFixed(1) : '—'}
            </span>
            <span className="match-player-stats__cell">{row.minutesPlayed}&apos;</span>
            <span className="match-player-stats__cell">{row.goals || ''}</span>
            <span className="match-player-stats__cell">{row.assists || ''}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
