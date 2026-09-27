// src/components/match/MatchPlayerStatsTable.jsx
// A tabbed, combined player table for both sides — fotmob's Stats-tab
// player breakdown (Top stats/Attack/Passes/Defense/Duels/Goalkeeping),
// built on the same matchEvents-derived minutes/goals/assists as the rest
// of the page plus the per-player matchPlayerStats dataset (xG, xA, shots,
// passing, defensive actions) authored for this match specifically.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import { squads, matchEvents, matchPlayerStats } from '../../data/mockData';
import './MatchPlayerStatsTable.css';

const TABS = [
  { id: 'TOP', label: 'Top stats' },
  { id: 'ATTACK', label: 'Attack' },
  { id: 'PASSES', label: 'Passes' },
  { id: 'DEFENSE', label: 'Defense' },
  { id: 'DUELS', label: 'Duels' },
  { id: 'GOALKEEPING', label: 'Goalkeeping' },
];

const COLUMNS = {
  TOP: [
    { key: 'rating', label: 'Rating' },
    { key: 'minutesPlayed', label: 'Min' },
    { key: 'goals', label: 'Goals' },
    { key: 'assists', label: 'Assists' },
    { key: 'xG', label: 'xG', fmt: (v) => v.toFixed(2) },
    { key: 'xA', label: 'xA', fmt: (v) => v.toFixed(2) },
    { key: 'xGxA', label: 'xG+xA', fmt: (v) => v.toFixed(2) },
  ],
  ATTACK: [
    { key: 'minutesPlayed', label: 'Min' },
    { key: 'goals', label: 'Goals' },
    { key: 'assists', label: 'Assists' },
    { key: 'shots', label: 'Shots' },
    { key: 'shotsOnTarget', label: 'On target' },
    { key: 'xG', label: 'xG', fmt: (v) => v.toFixed(2) },
    { key: 'xA', label: 'xA', fmt: (v) => v.toFixed(2) },
  ],
  PASSES: [
    { key: 'minutesPlayed', label: 'Min' },
    { key: 'passes', label: 'Passes' },
    { key: 'accuratePasses', label: 'Accurate' },
    { key: 'passAccuracy', label: 'Accuracy', fmt: (v) => `${v}%` },
  ],
  DEFENSE: [
    { key: 'minutesPlayed', label: 'Min' },
    { key: 'tackles', label: 'Tackles' },
    { key: 'interceptions', label: 'Interceptions' },
    { key: 'clearances', label: 'Clearances' },
    { key: 'defContrib', label: 'Def. actions' },
  ],
  DUELS: [
    { key: 'minutesPlayed', label: 'Min' },
    { key: 'duelsWon', label: 'Won' },
    { key: 'duelsTotal', label: 'Total' },
    { key: 'duelWinPct', label: 'Win %', fmt: (v) => `${v}%` },
  ],
  GOALKEEPING: [
    { key: 'minutesPlayed', label: 'Min' },
    { key: 'saves', label: 'Saves' },
    { key: 'goalsConceded', label: 'Conceded' },
    { key: 'savePct', label: 'Save %', fmt: (v) => `${v}%` },
  ],
};

function buildTeamRows(team, matchId, matchStatus, matchMinute) {
  const squad = squads[team?.id] ?? [];
  const startingIds = new Set(team?.lastMatchXI ?? []);
  const events = matchEvents[matchId] ?? [];
  const extra = matchPlayerStats[matchId] ?? {};

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
    if (!isStarter && cameOn == null) return;

    const minutesPlayed = isStarter
      ? (subOffMinute.get(p.name) ?? fullTimeMinute)
      : Math.max(0, fullTimeMinute - cameOn);

    const stats = extra[p.id] ?? {};
    const tackles = stats.tackles ?? 0;
    const interceptions = stats.interceptions ?? 0;
    const clearances = stats.clearances ?? 0;
    const passes = stats.passes ?? 0;
    const accuratePasses = stats.accuratePasses ?? 0;
    const duelsWon = stats.duelsWon ?? 0;
    const duelsTotal = stats.duelsTotal ?? 0;
    const saves = stats.saves;
    const xG = stats.xG ?? 0;
    const xA = stats.xA ?? 0;

    rows.push({
      id: p.id,
      name: p.name,
      position: p.position,
      isGk: p.position === 'GK',
      team,
      rating: p.rating,
      minutesPlayed,
      goals: goalCount.get(p.name) ?? 0,
      assists: assistCount.get(p.name) ?? 0,
      xG,
      xA,
      xGxA: xG + xA,
      shots: stats.shots ?? 0,
      shotsOnTarget: stats.shotsOnTarget ?? 0,
      passes,
      accuratePasses,
      passAccuracy: passes > 0 ? Math.round((accuratePasses / passes) * 100) : 0,
      tackles,
      interceptions,
      clearances,
      defContrib: tackles + interceptions + clearances,
      duelsWon,
      duelsTotal,
      duelWinPct: duelsTotal > 0 ? Math.round((duelsWon / duelsTotal) * 100) : 0,
      saves,
      goalsConceded: stats.goalsConceded,
      savePct: saves != null && (saves + (stats.goalsConceded ?? 0)) > 0
        ? Math.round((saves / (saves + stats.goalsConceded)) * 100)
        : null,
    });
  });
  return rows;
}

export default function MatchPlayerStatsTable({ homeTeam, awayTeam, matchId, matchStatus, matchMinute }) {
  const [tab, setTab] = useState('TOP');

  let rows = [
    ...buildTeamRows(homeTeam, matchId, matchStatus, matchMinute),
    ...buildTeamRows(awayTeam, matchId, matchStatus, matchMinute),
  ];
  if (rows.length === 0) return null;

  if (tab === 'GOALKEEPING') rows = rows.filter((r) => r.isGk);
  rows = rows.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  const navigate = useNavigate();
  const columns = COLUMNS[tab];

  return (
    <div className="match-player-stats">
      <h2 className="match-detail__card-title">Player Stats</h2>

      <div className="match-player-stats__tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`match-player-stats__tab ${tab === t.id ? 'match-player-stats__tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="match-player-stats__scroll">
        <div className="match-player-stats__list" style={{ minWidth: `${180 + columns.length * 64}px` }}>
          <div className="match-player-stats__head" style={{ gridTemplateColumns: `1fr repeat(${columns.length}, 64px)` }}>
            <span className="match-player-stats__head-player">Player</span>
            {columns.map((c) => (
              <span key={c.key} className="match-player-stats__head-cell">{c.label}</span>
            ))}
          </div>

          {rows.length === 0 ? (
            <p className="match-player-stats__empty">No goalkeeper data for this match.</p>
          ) : (
            rows.map((row) => (
              <button
                type="button"
                key={row.id}
                className="match-player-stats__row"
                style={{ gridTemplateColumns: `1fr repeat(${columns.length}, 64px)` }}
                onClick={() => navigate(`/players/${row.id}`)}
              >
                <span className="match-player-stats__player">
                  <Crest logoUrl={row.team.logoUrl} name={row.team.name} size={16} />
                  {row.name}
                </span>
                {columns.map((c) => {
                  const value = row[c.key];
                  const display = value == null ? '—' : c.fmt ? c.fmt(value) : (value || (c.key === 'rating' ? '—' : 0));
                  const isRating = c.key === 'rating';
                  return (
                    <span
                      key={c.key}
                      className={isRating ? `match-player-stats__rating ${row.rating >= 8 ? 'match-player-stats__rating--high' : ''}` : 'match-player-stats__cell'}
                    >
                      {isRating ? (row.rating != null ? row.rating.toFixed(1) : '—') : display}
                    </span>
                  );
                })}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
