// src/components/feed/MatchRow.jsx
// Match row: live/FT/time status · home badge+name · score · away name+badge · star

// TASK D — replaced TeamBadge (Sidebar import) with the shared Crest component.
//           team.logoUrl now comes from mockData directly.

import { useNavigate } from 'react-router-dom';
import PressureBar from './PressureBar';
import StarIcon from '../icons/StarIcon';
import Crest from '../shared/Crest'; // TASK D
import './MatchRow.css';


function formatTime(isoString) {
  if (!isoString) return '20:00';
  const d = new Date(isoString);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function LiveStatus({ minute }) {
  return (
    <div className="match-row__status">
      <div className="match-row__live-badge">
        <span className="live-dot" aria-hidden="true" />
        <span className="match-row__status-live">{minute}&apos;</span>
      </div>
    </div>
  );
}

function FinishedStatus() {
  return (
    <div className="match-row__status">
      <span className="match-row__status-ft">FT</span>
    </div>
  );
}

function UpcomingStatus() {
  return (
    <div className="match-row__status">
      <span className="match-row__status-upcoming">UPCOMING</span>
    </div>
  );
}

function ScoreBox({ match }) {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const scoreText = `${match.homeScore}  –  ${match.awayScore}`;
  const stateClass = isFinished ? 'score-box--finished' : isLive ? 'score-box--live' : 'score-box--upcoming';

  return (
    <div className={`score-box ${stateClass}`}>
      {scoreText}
    </div>
  );
}

export default function MatchRow({ match, isFavorited = false, onToggleFav, animationDelay = 0, showLeague = false }) {
  const navigate = useNavigate();

  const handleRowClick = () => navigate(`/matches/${match.id}`);
  const handleTeamClick = (e, id) => { e.stopPropagation(); navigate(`/teams/${id}`); };
  const handleStarClick = (e) => { e.stopPropagation(); onToggleFav?.(match.id); };

  const StatusComponent = (() => {
    if (match.status === 'live') return <LiveStatus minute={match.minute} />;
    if (match.status === 'finished') return <FinishedStatus />;
    return <UpcomingStatus />;
  })();

  const isUpcoming = match.status === 'upcoming';
  const delayIndex = Math.min(Math.floor(animationDelay / 35), 5);

  return (
    <div className={`row-animate row-animate--delay-${delayIndex}`}>
      {/* Main row */}
      <div
        id={`match-row-${match.id}`}
        className={`match-row__main${isFavorited ? ' match-row__main--favorited' : ''}`}
        onClick={handleRowClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleRowClick()}
        aria-label={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
      >
        {/* Status */}
        {StatusComponent}

        {/* Optional inline league tag for flattened views */}
        {showLeague && (
          <span className="match-row__league-tag">{match.league}</span>
        )}

        {/* Home side: name (right-aligned) + badge */}
        <div className="match-row__home">
          <button
            className="match-row__team-name match-row__team-name--home"
            onClick={(e) => handleTeamClick(e, match.homeTeam.id)}
          >
            {match.homeTeam.name}
          </button>
          {/* TASK D — Crest replaces TeamBadge; size=20 for match row context */}
          <button
            className="match-row__badge-btn"
            onClick={(e) => handleTeamClick(e, match.homeTeam.id)}
          >
            <Crest logoUrl={match.homeTeam.logoUrl} name={match.homeTeam.name} size={20} />
          </button>

        </div>

        {/* Score box or Prominent Kickoff Time */}
        {isUpcoming ? (
          <div className="match-row__kickoff-slot">
            {formatTime(match.matchDateUtc)}
          </div>
        ) : (
          <ScoreBox match={match} />
        )}

        {/* Away side: badge + name (left-aligned) */}
        <div className="match-row__away">
          {/* TASK D — Crest replaces TeamBadge */}
          <button
            className="match-row__badge-btn"
            onClick={(e) => handleTeamClick(e, match.awayTeam.id)}
          >
            <Crest logoUrl={match.awayTeam.logoUrl} name={match.awayTeam.name} size={20} />
          </button>

          <button
            className="match-row__team-name match-row__team-name--away"
            onClick={(e) => handleTeamClick(e, match.awayTeam.id)}
          >
            {match.awayTeam.name}
          </button>
        </div>

        {/* Star toggle */}
        <button
          className="match-row__star-btn"
          onClick={handleStarClick}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorited}
        >
          <StarIcon filled={isFavorited} size={16} />
        </button>
      </div>

      {/* Pressure bar for live matches */}
      {match.status === 'live' && (
        <div className="match-row__pressure">
          <PressureBar
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            homePercent={match.pressureHome}
            awayPercent={match.pressureAway}
            lastSynced={match.lastSynced}
          />
        </div>
      )}
    </div>
  );
}
