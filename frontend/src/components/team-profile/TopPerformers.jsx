// src/components/team-profile/TopPerformers.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import { squads } from '../../data/mockData';
import './TopPerformers.css';

export default function TopPerformers({ team }) {
  const navigate = useNavigate();
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

  const handlePlayerClick = (playerId) => {
    if (playerId) {
      navigate(`/players/${playerId}`);
    }
  };

  const handleKeyDown = (e, playerId) => {
    if ((e.key === 'Enter' || e.key === ' ') && playerId) {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/players/${playerId}`);
    }
  };

  return (
    <div className="top-performers-card">
      {/* Column 1: Top Rated */}
      <div className="top-performers-column">
        <div className="top-performers-column__header">
          <h3 className="top-performers-column__title">TOP RATED</h3>
        </div>
        <div className="top-performers-column__list">
          {topRated.map((p, idx) => (
            <div
              key={p.id}
              className="top-performer-row"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayerClick(p.id);
              }}
              onKeyDown={(e) => handleKeyDown(e, p.id)}
              title={`View ${p.name} profile`}
            >
              <div className="top-performer-group">
                <div className="top-performer-avatar">
                  <span>{p.shirtNumber}</span>
                </div>
                <div className="top-performer-details">
                  <span className="top-performer-name">{p.name}</span>
                  <div className="top-performer-team">
                    <Crest logoUrl={team?.logoUrl ?? team?.crestUrl} name={team?.name} size={12} />
                    <span className="top-performer-team-name">{team?.name ?? team?.shortName}</span>
                  </div>
                </div>
              </div>
              <span
                className={`top-performer-stat ${
                  idx === 0 ? 'top-performer-stat--rank1' : 'top-performer-stat--plain'
                }`}
              >
                {p.rating?.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Top Scorers */}
      <div className="top-performers-column">
        <div className="top-performers-column__header">
          <h3 className="top-performers-column__title">TOP SCORERS</h3>
        </div>
        <div className="top-performers-column__list">
          {topScorers.map((p, idx) => (
            <div
              key={p.id}
              className="top-performer-row"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayerClick(p.id);
              }}
              onKeyDown={(e) => handleKeyDown(e, p.id)}
              title={`View ${p.name} profile`}
            >
              <div className="top-performer-group">
                <div className="top-performer-avatar">
                  <span>{p.shirtNumber}</span>
                </div>
                <div className="top-performer-details">
                  <span className="top-performer-name">{p.name}</span>
                  <div className="top-performer-team">
                    <Crest logoUrl={team?.logoUrl ?? team?.crestUrl} name={team?.name} size={12} />
                    <span className="top-performer-team-name">{team?.name ?? team?.shortName}</span>
                  </div>
                </div>
              </div>
              <span
                className={`top-performer-stat ${
                  idx === 0 ? 'top-performer-stat--rank1' : 'top-performer-stat--plain'
                }`}
              >
                {p.goals}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Column 3: Top Assists */}
      <div className="top-performers-column">
        <div className="top-performers-column__header">
          <h3 className="top-performers-column__title">TOP ASSISTS</h3>
        </div>
        <div className="top-performers-column__list">
          {topAssists.map((p, idx) => (
            <div
              key={p.id}
              className="top-performer-row"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayerClick(p.id);
              }}
              onKeyDown={(e) => handleKeyDown(e, p.id)}
              title={`View ${p.name} profile`}
            >
              <div className="top-performer-group">
                <div className="top-performer-avatar">
                  <span>{p.shirtNumber}</span>
                </div>
                <div className="top-performer-details">
                  <span className="top-performer-name">{p.name}</span>
                  <div className="top-performer-team">
                    <Crest logoUrl={team?.logoUrl ?? team?.crestUrl} name={team?.name} size={12} />
                    <span className="top-performer-team-name">{team?.name ?? team?.shortName}</span>
                  </div>
                </div>
              </div>
              <span
                className={`top-performer-stat ${
                  idx === 0 ? 'top-performer-stat--rank1' : 'top-performer-stat--plain'
                }`}
              >
                {p.assists}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

