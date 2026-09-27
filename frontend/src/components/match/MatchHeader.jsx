// src/components/match/MatchHeader.jsx
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Crest from '../shared/Crest';
import { formatKickoffTime } from '../../utils/matchHelpers';
import { leagues } from '../../data/mockData';
import './MatchHeader.css';

function formatMatchDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function MatchHeader({ match, tabs, activeTab, onTabChange }) {
  const navigate = useNavigate();
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isUpcoming = match.status === 'upcoming';

  const statusLabel = isLive
    ? `${match.minute}'`
    : isFinished
    ? 'Full time'
    : `${formatMatchDate(match.matchDateUtc)}, ${formatKickoffTime(match.matchDateUtc)}`;

  const leagueObj = leagues.find((l) => l.name === match.league);

  return (
    <header className="match-header">
      <button type="button" className="match-header__back" onClick={() => navigate(-1)}>
        <ChevronLeft size={16} strokeWidth={2.5} />
        Back
      </button>

      <div className="match-header__league-row">
        {leagueObj?.logoUrl && (
          <Crest logoUrl={leagueObj.logoUrl} name={match.league} size={16} />
        )}
        <span className="match-header__league">{match.league}</span>
        {match.venue && <span className="match-header__venue">{match.venue}</span>}
      </div>

      <div className="match-header__scoreline">
        <button
          type="button"
          className="match-header__team match-header__team--home"
          onClick={() => navigate(`/teams/${match.homeTeam.id}`)}
        >
          <Crest logoUrl={match.homeTeam.logoUrl} name={match.homeTeam.name} size={48} />
          <span className="match-header__team-name">{match.homeTeam.name}</span>
        </button>

        <div className="match-header__center">
          {isUpcoming ? (
            <span className="match-header__kickoff">{formatKickoffTime(match.matchDateUtc)}</span>
          ) : (
            <div className={`score-box match-header__score ${isLive ? 'score-box--live' : isFinished ? 'score-box--finished' : ''}`}>
              {match.homeScore} – {match.awayScore}
            </div>
          )}
          <span className={`match-header__status ${isLive ? 'match-header__status--live' : ''}`}>
            {isLive && <span className="live-dot" aria-hidden="true" />}
            {statusLabel}
          </span>
        </div>

        <button
          type="button"
          className="match-header__team match-header__team--away"
          onClick={() => navigate(`/teams/${match.awayTeam.id}`)}
        >
          <Crest logoUrl={match.awayTeam.logoUrl} name={match.awayTeam.name} size={48} />
          <span className="match-header__team-name">{match.awayTeam.name}</span>
        </button>
      </div>

      <nav className="match-header__tabs" aria-label="Match detail sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`match-header__tab ${activeTab === tab.id ? 'match-header__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
