// src/components/match/MatchH2H.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { matches as allMatches } from '../../data/mockData';
import Crest from '../shared/Crest';
import './MatchH2H.css';

export default function MatchH2H({ match }) {
  const navigate = useNavigate();
  const homeId = match.homeTeam.id;
  const awayId = match.awayTeam.id;

  const meetings = useMemo(() => {
    return allMatches
      .filter(
        (m) =>
          m.id !== match.id &&
          m.status === 'finished' &&
          ((m.homeTeam.id === homeId && m.awayTeam.id === awayId) ||
            (m.homeTeam.id === awayId && m.awayTeam.id === homeId))
      )
      .sort((a, b) => new Date(b.matchDateUtc) - new Date(a.matchDateUtc));
  }, [homeId, awayId, match.id]);

  const record = useMemo(() => {
    let homeWins = 0, awayWins = 0, draws = 0;
    meetings.forEach((m) => {
      const homeIsThisHome = m.homeTeam.id === homeId;
      const homeGoals = homeIsThisHome ? m.homeScore : m.awayScore;
      const awayGoals = homeIsThisHome ? m.awayScore : m.homeScore;
      if (homeGoals > awayGoals) homeWins++;
      else if (awayGoals > homeGoals) awayWins++;
      else draws++;
    });
    return { homeWins, awayWins, draws };
  }, [meetings, homeId]);

  if (meetings.length === 0) {
    return (
      <div className="match-h2h">
        <p className="match-h2h__empty">
          {match.homeTeam.name} and {match.awayTeam.name} haven&apos;t met before in recorded matches.
        </p>
      </div>
    );
  }

  return (
    <div className="match-h2h">
      <div className="match-h2h__summary">
        <div className="match-h2h__summary-stat">
          <Crest logoUrl={match.homeTeam.logoUrl} name={match.homeTeam.name} size={28} />
          <span className="match-h2h__summary-circle" style={{ backgroundColor: match.homeTeam.primaryColor }}>
            {record.homeWins}
          </span>
          <span className="match-h2h__summary-label">Wins</span>
        </div>
        <div className="match-h2h__summary-stat">
          <span className="match-h2h__summary-dash" aria-hidden="true" />
          <span className="match-h2h__summary-circle match-h2h__summary-circle--draw">{record.draws}</span>
          <span className="match-h2h__summary-label">Draws</span>
        </div>
        <div className="match-h2h__summary-stat">
          <Crest logoUrl={match.awayTeam.logoUrl} name={match.awayTeam.name} size={28} />
          <span className="match-h2h__summary-circle" style={{ backgroundColor: match.awayTeam.primaryColor }}>
            {record.awayWins}
          </span>
          <span className="match-h2h__summary-label">Wins</span>
        </div>
      </div>

      <div className="match-h2h__list">
        {meetings.map((m) => (
          <button
            type="button"
            key={m.id}
            className="match-h2h__row"
            onClick={() => navigate(`/matches/${m.id}`)}
          >
            <span className="match-h2h__date">
              {new Date(m.matchDateUtc).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <div className="match-h2h__row-teams">
              <span className="match-h2h__row-team">
                <Crest logoUrl={m.homeTeam.logoUrl} name={m.homeTeam.name} size={20} />
                {m.homeTeam.shortName}
              </span>
              <span className="match-h2h__row-score">{m.homeScore} – {m.awayScore}</span>
              <span className="match-h2h__row-team match-h2h__row-team--away">
                {m.awayTeam.shortName}
                <Crest logoUrl={m.awayTeam.logoUrl} name={m.awayTeam.name} size={20} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
