// src/components/match/MatchHeader.jsx
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, Clock } from 'lucide-react';
import Crest from '../shared/Crest';
import { formatKickoffTime } from '../../utils/matchHelpers';
import { leagues, matchEvents } from '../../data/mockData';
import './MatchHeader.css';

function formatFullDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'long' });
}

export default function MatchHeader({ match, tabs, activeTab, onTabChange }) {
  const navigate = useNavigate();
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isUpcoming = match.status === 'upcoming';

  const statusLabel = isLive ? `${match.minute}'` : isFinished ? 'Full time' : null;
  const leagueObj = leagues.find((l) => l.name === match.league);

  // Compact scorer summary next to the score, grouped per player so a
  // brace/hat-trick shows as one line with both minutes instead of
  // repeating the name — same as the reference's goal-list treatment.
  const scorers = (() => {
    const events = matchEvents[match.id];
    if (!events) return [];
    const goals = events.filter((e) => e.type === 'goal');
    const byPlayer = new Map();
    goals.forEach((g) => {
      if (!byPlayer.has(g.player)) byPlayer.set(g.player, []);
      byPlayer.get(g.player).push(g.minute);
    });
    return [...byPlayer.entries()].map(([player, minutes]) => ({
      player,
      minutes: minutes.sort((a, b) => a - b),
    }));
  })();

  return (
    <header className="match-header">
      <div className="match-header__top-row">
        <button type="button" className="match-header__back" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <div className="match-header__league-row">
          {leagueObj?.logoUrl && <Crest logoUrl={leagueObj.logoUrl} name={match.league} size={18} />}
          <span className="match-header__league">
            {match.league}
            {leagueObj?.matchday ? ` Round ${leagueObj.matchday}` : ''}
          </span>
        </div>
        <span className="match-header__top-spacer" aria-hidden="true" />
      </div>

      <div className="match-header__info-row">
        <span className="match-header__info-item">
          <Calendar size={14} strokeWidth={1.75} />
          {formatFullDate(match.matchDateUtc)}, {formatKickoffTime(match.matchDateUtc)}
        </span>
        {match.venue && (
          <span className="match-header__info-item">
            <MapPin size={14} strokeWidth={1.75} />
            {match.venue}
          </span>
        )}
      </div>

      <div className="match-header__scoreline">
        <button
          type="button"
          className="match-header__team match-header__team--home"
          onClick={() => navigate(`/teams/${match.homeTeam.id}`)}
        >
          <span className="match-header__team-name">{match.homeTeam.name}</span>
          <Crest logoUrl={match.homeTeam.logoUrl} name={match.homeTeam.name} size={48} />
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

      {scorers.length > 0 && (
        <div className="match-header__scorers">
          <Clock size={13} strokeWidth={1.75} className="match-header__scorers-icon" />
          <div className="match-header__scorers-list">
            {scorers.map((s) => (
              <span key={s.player} className="match-header__scorer">
                {s.player} {s.minutes.map((m) => `${m}'`).join(', ')}
              </span>
            ))}
          </div>
        </div>
      )}

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
