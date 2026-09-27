// src/components/match/MatchInsights.jsx — sidebar facts widget
import { Info } from 'lucide-react';
import Crest from '../shared/Crest';
import './MatchInsights.css';

export default function MatchInsights({ facts, match }) {
  if (!facts || facts.length === 0) return null;

  return (
    <div className="match-insights">
      <h2 className="match-detail__card-title">
        <Info size={16} strokeWidth={2} /> Insights
      </h2>
      <ul className="match-insights__list">
        {facts.map((f, i) => {
          const team = f.team === 'home' ? match.homeTeam : f.team === 'away' ? match.awayTeam : null;
          return (
            <li
              key={i}
              className="match-insights__item"
              style={{ borderLeftColor: team?.primaryColor ?? 'var(--color-border)' }}
            >
              {team && <Crest logoUrl={team.logoUrl} name={team.name} size={20} />}
              <span>{f.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
