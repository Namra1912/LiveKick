// src/components/match/MatchInsights.jsx — sidebar facts widget
import { Info } from 'lucide-react';
import './MatchInsights.css';

export default function MatchInsights({ facts }) {
  if (!facts || facts.length === 0) return null;

  return (
    <div className="match-insights">
      <h2 className="match-detail__card-title">
        <Info size={16} strokeWidth={2} /> Insights
      </h2>
      <ul className="match-insights__list">
        {facts.map((f, i) => (
          <li key={i} className="match-insights__item">{f}</li>
        ))}
      </ul>
    </div>
  );
}
