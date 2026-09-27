// src/components/match/MatchHighlightsCard.jsx
import { Play } from 'lucide-react';
import Crest from '../shared/Crest';
import { matchHighlights } from '../../data/mockData';
import './MatchHighlightsCard.css';

export default function MatchHighlightsCard({ match }) {
  const clip = matchHighlights[match.id];
  if (!clip) return null;

  const homeWon = match.homeScore > match.awayScore;
  const awayWon = match.awayScore > match.homeScore;

  return (
    <div className="match-highlights">
      <h2 className="match-detail__card-title">Official Highlights</h2>
      <span className="match-highlights__source">www.youtube.com</span>

      <a
        className="match-highlights__thumb"
        href={clip.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="match-highlights__bg" style={{ backgroundImage: `url(${clip.thumbnailUrl})` }} />
        <span className="match-highlights__ribbon">Highlights</span>

        <span className="match-highlights__score">
          <span className="match-highlights__score-row">
            <Crest logoUrl={match.homeTeam.logoUrl} name={match.homeTeam.name} size={18} />
            <span
              className="match-highlights__score-num"
              style={homeWon ? { backgroundColor: match.homeTeam.primaryColor, color: '#080c11' } : undefined}
            >
              {match.homeScore}
            </span>
          </span>
          <span className="match-highlights__score-row">
            <Crest logoUrl={match.awayTeam.logoUrl} name={match.awayTeam.name} size={18} />
            <span
              className="match-highlights__score-num"
              style={awayWon ? { backgroundColor: match.awayTeam.primaryColor, color: '#080c11' } : undefined}
            >
              {match.awayScore}
            </span>
          </span>
        </span>

        <span className="match-highlights__play">
          <Play size={18} fill="currentColor" strokeWidth={0} />
        </span>
      </a>
    </div>
  );
}
