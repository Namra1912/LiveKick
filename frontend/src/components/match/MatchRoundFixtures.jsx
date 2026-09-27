// src/components/match/MatchRoundFixtures.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { matches } from '../../data/mockData';
import Crest from '../shared/Crest';
import './MatchRoundFixtures.css';

export default function MatchRoundFixtures({ match }) {
  const navigate = useNavigate();

  // Includes the match being viewed, so it shows highlighted in context
  // among its round instead of being excluded from its own round list.
  const roundMatches = useMemo(() => {
    return matches
      .filter((m) => m.league === match.league)
      .sort((a, b) => new Date(a.matchDateUtc) - new Date(b.matchDateUtc))
      .slice(0, 6);
  }, [match]);

  if (roundMatches.length === 0) return null;

  return (
    <div className="match-round-fixtures">
      <h2 className="match-detail__card-title">{match.league}</h2>
      <div className="match-round-fixtures__list">
        {roundMatches.map((m) => (
          <button
            type="button"
            key={m.id}
            className={`match-round-fixtures__row ${m.id === match.id ? 'match-round-fixtures__row--active' : ''}`}
            onClick={() => navigate(`/matches/${m.id}`)}
          >
            <div className="match-round-fixtures__team">
              <Crest logoUrl={m.homeTeam.logoUrl} name={m.homeTeam.name} size={18} />
              <span>{m.homeTeam.shortName}</span>
            </div>
            <span className={`match-round-fixtures__score ${m.status === 'live' ? 'match-round-fixtures__score--live' : ''}`}>
              {m.status === 'upcoming'
                ? new Date(m.matchDateUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : `${m.homeScore} - ${m.awayScore}`}
            </span>
            <div className="match-round-fixtures__team match-round-fixtures__team--away">
              <span>{m.awayTeam.shortName}</span>
              <Crest logoUrl={m.awayTeam.logoUrl} name={m.awayTeam.name} size={18} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
