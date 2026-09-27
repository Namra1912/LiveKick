// src/components/match/MatchLineupPitch.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Goal, Footprints } from 'lucide-react';
import { squads, matchEvents } from '../../data/mockData';
import Crest from '../shared/Crest';
import './MatchLineupPitch.css';

function averageRating(players) {
  const rated = players.filter((p) => p.rating != null);
  if (rated.length === 0) return null;
  return (rated.reduce((sum, p) => sum + p.rating, 0) / rated.length).toFixed(1);
}

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

function TeamHalf({ team, flipped, goalMap, assistMap }) {
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
          {rows[key].map((p) => {
            const goals = goalMap.get(p.name);
            const assists = assistMap.get(p.name);
            return (
              <button
                type="button"
                key={p.id}
                className="lineup-player"
                onClick={() => navigate(`/players/${p.id}`)}
              >
                <span className="lineup-player__avatar-wrap">
                  <span className="lineup-player__avatar">{p.shirtNumber}</span>
                  {p.rating != null && (
                    <span className={`lineup-player__rating ${p.rating >= 8 ? 'lineup-player__rating--high' : ''}`}>
                      {p.rating.toFixed(1)}
                    </span>
                  )}
                </span>
                <span className="lineup-player__name">{p.name.split(' ').pop()}</span>
                {(goals || assists) && (
                  <span className="lineup-player__contrib">
                    {goals && (
                      <span className="lineup-player__contrib-badge lineup-player__contrib-badge--goal" title={`${goals} goal${goals > 1 ? 's' : ''}`}>
                        <Goal size={9} strokeWidth={2.5} />
                        {goals > 1 && goals}
                      </span>
                    )}
                    {assists && (
                      <span className="lineup-player__contrib-badge lineup-player__contrib-badge--assist" title={`${assists} assist${assists > 1 ? 's' : ''}`}>
                        <Footprints size={9} strokeWidth={2.5} />
                        {assists > 1 && assists}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function getInitials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function CoachRow({ homeTeam, awayTeam }) {
  const homeCoach = squads[homeTeam?.id]?.find((p) => p.isCoach);
  const awayCoach = squads[awayTeam?.id]?.find((p) => p.isCoach);
  if (!homeCoach && !awayCoach) return null;

  return (
    <div className="lineup-coach-row">
      <span className="lineup-coach lineup-coach--home">
        {homeCoach && <span className="lineup-coach__avatar">{getInitials(homeCoach.name)}</span>}
        {homeCoach?.name ?? '—'}
      </span>
      <span className="lineup-coach__label">Coach</span>
      <span className="lineup-coach lineup-coach--away">
        {awayCoach?.name ?? '—'}
        {awayCoach && <span className="lineup-coach__avatar">{getInitials(awayCoach.name)}</span>}
      </span>
    </div>
  );
}

function Bench({ team, subInMap }) {
  const navigate = useNavigate();
  const squad = squads[team?.id] ?? [];
  const startingIds = new Set(team?.lastMatchXI ?? []);
  const bench = squad.filter((p) => !p.isCoach && !startingIds.has(p.id));

  if (!team?.lastMatchXI || bench.length === 0) return null;

  return (
    <div className="lineup-bench">
      <div className="lineup-bench__list">
        {bench.map((p) => {
          const subMinute = subInMap.get(p.name);
          const used = subMinute != null;
          return (
            <button
              type="button"
              key={p.id}
              className={`lineup-bench__player ${!used ? 'lineup-bench__player--unused' : ''}`}
              onClick={() => navigate(`/players/${p.id}`)}
            >
              <span className="lineup-bench__number">{p.shirtNumber ?? '—'}</span>
              <span className="lineup-bench__name">{p.name}</span>
              <span className="lineup-bench__pos">{p.position}</span>
              {used ? (
                <span className="lineup-bench__sub-in">
                  {p.rating != null && <span className="lineup-bench__sub-rating">{p.rating.toFixed(1)}</span>}
                  <ArrowUpRight size={13} strokeWidth={2.5} />
                  {subMinute}&apos;
                </span>
              ) : (
                <span className="lineup-bench__unused-label">Unused</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MatchLineupPitch({ homeTeam, awayTeam, homeFormation, awayFormation, matchId }) {
  const bothMissing = !squads[homeTeam?.id] && !squads[awayTeam?.id];

  const homeXI = (homeTeam?.lastMatchXI ?? []).map((id) => squads[homeTeam.id]?.find((p) => p.id === id)).filter(Boolean);
  const awayXI = (awayTeam?.lastMatchXI ?? []).map((id) => squads[awayTeam.id]?.find((p) => p.id === id)).filter(Boolean);
  const homeAvg = averageRating(homeXI);
  const awayAvg = averageRating(awayXI);

  const subEvents = (matchId != null ? matchEvents[matchId] : null) ?? [];
  const homeSubIn = new Map(subEvents.filter((e) => e.type === 'sub' && e.team === 'home').map((e) => [e.playerOn, e.minute]));
  const awaySubIn = new Map(subEvents.filter((e) => e.type === 'sub' && e.team === 'away').map((e) => [e.playerOn, e.minute]));

  const countBy = (events, team, key) => {
    const map = new Map();
    events.filter((e) => e.type === 'goal' && e.team === team && e[key]).forEach((e) => {
      map.set(e[key], (map.get(e[key]) ?? 0) + 1);
    });
    return map;
  };
  const homeGoals = countBy(subEvents, 'home', 'player');
  const awayGoals = countBy(subEvents, 'away', 'player');
  const homeAssists = countBy(subEvents, 'home', 'assist');
  const awayAssists = countBy(subEvents, 'away', 'assist');

  const hasSquads = squads[homeTeam?.id] || squads[awayTeam?.id];

  return (
    <div className="match-lineup-card">
      <div className="match-lineup-card__header">
        <div className="match-lineup-card__side">
          <Crest logoUrl={homeTeam?.logoUrl} name={homeTeam?.name} size={22} />
          <span className="match-lineup-card__formation">{homeFormation ?? homeTeam?.formation ?? '—'}</span>
          {homeAvg && <span className="match-lineup-card__rating">{homeAvg}</span>}
        </div>
        <span className="match-lineup-card__title">Lineups</span>
        <div className="match-lineup-card__side match-lineup-card__side--away">
          {awayAvg && <span className="match-lineup-card__rating">{awayAvg}</span>}
          <span className="match-lineup-card__formation">{awayFormation ?? awayTeam?.formation ?? '—'}</span>
          <Crest logoUrl={awayTeam?.logoUrl} name={awayTeam?.name} size={22} />
        </div>
      </div>
      <div className="match-pitch">
        <div className="match-pitch__lines">
          <div className="match-pitch__penalty-top" />
          <div className="match-pitch__goal-top" />
          <div className="match-pitch__center-line" />
          <div className="match-pitch__center-circle" />
          <div className="match-pitch__penalty-bottom" />
          <div className="match-pitch__goal-bottom" />
        </div>
        {bothMissing ? (
          <p className="lineup-half__empty lineup-half__empty--full">
            Lineups haven&apos;t been announced for this match yet.
          </p>
        ) : (
          <>
            <TeamHalf team={awayTeam} flipped goalMap={awayGoals} assistMap={awayAssists} />
            <TeamHalf team={homeTeam} goalMap={homeGoals} assistMap={homeAssists} />
          </>
        )}
      </div>

      <CoachRow homeTeam={homeTeam} awayTeam={awayTeam} />

      {hasSquads && (
        <div className="match-lineup-benches">
          <h3 className="lineup-bench__title">Substitutes</h3>
          <div className="match-lineup-benches__cols">
            <Bench team={homeTeam} subInMap={homeSubIn} />
            <Bench team={awayTeam} subInMap={awaySubIn} />
          </div>
        </div>
      )}
    </div>
  );
}
