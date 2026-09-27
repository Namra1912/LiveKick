// src/components/match/MatchLineupPitch.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { squads } from '../../data/mockData';
import './MatchLineupPitch.css';

function splitFormation(players) {
  if (players.length < 11) {
    return { gk: players.slice(0, 1), def: players.slice(1, 5), mid: players.slice(5, 8), fwd: players.slice(8, 11) };
  }
  return {
    gk: [players[0]],
    def: [players[1], players[2], players[3], players[4]],
    mid: [players[5], players[6], players[7]],
    fwd: [players[8], players[9], players[10]],
  };
}

function TeamHalf({ team, flipped }) {
  const navigate = useNavigate();
  const squad = squads[team?.id] ?? [];
  const startingIds = team?.lastMatchXI;

  if (!startingIds || squad.length === 0) {
    return (
      <div className={`lineup-half lineup-half--${flipped ? 'away' : 'home'}`}>
        <p className="lineup-half__empty">Lineup not available for {team?.name}</p>
      </div>
    );
  }

  const players = startingIds.map((id) => squad.find((p) => p.id === id)).filter(Boolean);
  const rows = splitFormation(players);
  const order = flipped ? ['gk', 'def', 'mid', 'fwd'] : ['fwd', 'mid', 'def', 'gk'];

  return (
    <div className={`lineup-half lineup-half--${flipped ? 'away' : 'home'}`}>
      {order.map((key) => (
        <div className="lineup-row" key={key}>
          {rows[key].map((p) => (
            <button
              type="button"
              key={p.id}
              className="lineup-player"
              onClick={() => navigate(`/players/${p.id}`)}
            >
              <span className="lineup-player__avatar">{p.shirtNumber}</span>
              <span className="lineup-player__name">{p.name.split(' ').pop()}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function Bench({ team }) {
  const navigate = useNavigate();
  const squad = squads[team?.id] ?? [];
  const startingIds = new Set(team?.lastMatchXI ?? []);
  const bench = squad.filter((p) => !p.isCoach && !startingIds.has(p.id));

  if (!team?.lastMatchXI || bench.length === 0) return null;

  return (
    <div className="lineup-bench">
      <h3 className="lineup-bench__title">{team.name} Substitutes</h3>
      <div className="lineup-bench__list">
        {bench.map((p) => (
          <button type="button" key={p.id} className="lineup-bench__player" onClick={() => navigate(`/players/${p.id}`)}>
            <span className="lineup-bench__number">{p.shirtNumber ?? '—'}</span>
            <span className="lineup-bench__name">{p.name}</span>
            <span className="lineup-bench__pos">{p.position}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MatchLineupPitch({ homeTeam, awayTeam, homeFormation, awayFormation }) {
  const bothMissing = !squads[homeTeam?.id] && !squads[awayTeam?.id];

  return (
    <div className="match-lineup-wrap">
      <div className="match-lineup-card">
        <div className="match-lineup-card__header">
          <span className="match-lineup-card__formation">{homeFormation ?? homeTeam?.formation ?? '—'}</span>
          <span className="match-lineup-card__title">Lineups</span>
          <span className="match-lineup-card__formation">{awayFormation ?? awayTeam?.formation ?? '—'}</span>
        </div>
        <div className="match-pitch">
          <div className="match-pitch__lines">
            <div className="match-pitch__center-line" />
            <div className="match-pitch__center-circle" />
          </div>
          {bothMissing ? (
            <p className="lineup-half__empty lineup-half__empty--full">
              Lineups haven&apos;t been announced for this match yet.
            </p>
          ) : (
            <>
              <TeamHalf team={awayTeam} flipped />
              <TeamHalf team={homeTeam} />
            </>
          )}
        </div>
      </div>

      {(squads[homeTeam?.id] || squads[awayTeam?.id]) && (
        <div className="match-lineup-benches">
          <Bench team={homeTeam} />
          <Bench team={awayTeam} />
        </div>
      )}
    </div>
  );
}
