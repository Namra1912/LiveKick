// src/components/panels/MatchOfTheDayCard.jsx
// "Match of the Day" feature card — large crests, kickoff time, description

import { useNavigate } from 'react-router-dom';
import { TeamBadge } from '../layout/Sidebar';
import './MatchOfTheDayCard.css';

export default function MatchOfTheDayCard({ match }) {
  const navigate = useNavigate();
  if (!match) return null;

  const d = new Date(match.matchDateUtc);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  const kickoffTime = `${h}:${m}`;

  return (
    <article
      className="motd-card"
      onClick={() => navigate(`/matches/${match.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/matches/${match.id}`)}
    >
      {/* Top: crests + time */}
      <div className="motd-card__top">
        <TeamBadge team={match.homeTeam} size="lg" />

        {/* Center: TONIGHT + time */}
        <div className="motd-card__time-block">
          <span className="motd-card__time-label">Tonight</span>
          <div className="score-box motd-card__time-box">{kickoffTime}</div>
        </div>

        <TeamBadge team={match.awayTeam} size="lg" />
      </div>

      {/* Bottom: label + matchup + desc */}
      <div className="motd-card__bottom">
        <span className="motd-card__label">Match of the Day</span>
        <h3 className="motd-card__matchup">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </h3>
        <p className="motd-card__desc">
          {match.venue} — both sides look to secure a crucial three points in this top-flight encounter.
        </p>
      </div>
    </article>
  );
}
