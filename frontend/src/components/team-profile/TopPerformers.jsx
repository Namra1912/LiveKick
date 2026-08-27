// src/components/team-profile/TopPerformers.jsx
import { useMemo } from 'react';
import { squads } from '../../data/mockData';
import './TopPerformers.css';

export default function TopPerformers({ team }) {
  const teamSquad = useMemo(() => squads[team?.id] ?? [], [team]);

  const topRated = useMemo(() => {
    return [...teamSquad].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3);
  }, [teamSquad]);

  const topScorers = useMemo(() => {
    return [...teamSquad].sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0)).slice(0, 3);
  }, [teamSquad]);

  const topAssists = useMemo(() => {
    return [...teamSquad].sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0)).slice(0, 3);
  }, [teamSquad]);

  return (
    <div className="top-performers">
      {/* Column 1: Top Rated */}
      <div className="top-performers__card">
        <div className="top-performers__header">
          <span className="top-performers__title">TOP RATED</span>
          <span className="top-performers__sub">Match Rating</span>
        </div>
        <div className="top-performers__list">
          {topRated.map((p, idx) => (
            <div key={p.id} className="top-performers__row">
              <div className="top-performers__player-group">
                <span className="top-performers__rank">{idx + 1}</span>
                <div className="top-performers__avatar">
                  <span>{p.shirtNumber}</span>
                </div>
                <div className="top-performers__details">
                  <span className="top-performers__name">{p.name}</span>
                  <span className="top-performers__pos">{p.position}</span>
                </div>
              </div>
              <span className="top-performers__stat top-performers__stat--rating">
                {p.rating?.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Top Scorers */}
      <div className="top-performers__card">
        <div className="top-performers__header">
          <span className="top-performers__title">TOP SCORERS</span>
          <span className="top-performers__sub">Season Goals</span>
        </div>
        <div className="top-performers__list">
          {topScorers.map((p, idx) => (
            <div key={p.id} className="top-performers__row">
              <div className="top-performers__player-group">
                <span className="top-performers__rank">{idx + 1}</span>
                <div className="top-performers__avatar">
                  <span>{p.shirtNumber}</span>
                </div>
                <div className="top-performers__details">
                  <span className="top-performers__name">{p.name}</span>
                  <span className="top-performers__pos">{p.position}</span>
                </div>
              </div>
              <span className="top-performers__stat top-performers__stat--goals">
                {p.goals} <small>goals</small>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Column 3: Top Assists */}
      <div className="top-performers__card">
        <div className="top-performers__header">
          <span className="top-performers__title">TOP ASSISTS</span>
          <span className="top-performers__sub">Season Assists</span>
        </div>
        <div className="top-performers__list">
          {topAssists.map((p, idx) => (
            <div key={p.id} className="top-performers__row">
              <div className="top-performers__player-group">
                <span className="top-performers__rank">{idx + 1}</span>
                <div className="top-performers__avatar">
                  <span>{p.shirtNumber}</span>
                </div>
                <div className="top-performers__details">
                  <span className="top-performers__name">{p.name}</span>
                  <span className="top-performers__pos">{p.position}</span>
                </div>
              </div>
              <span className="top-performers__stat top-performers__stat--assists">
                {p.assists} <small>ast</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
