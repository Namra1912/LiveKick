// src/components/team-profile/AboutSection.jsx
import { useState } from 'react';
import './AboutSection.css';

export default function AboutSection({ team }) {
  const [expanded, setExpanded] = useState(false);

  const honoursList = team?.honours ?? [
    '5x Champions League',
    '27x La Liga',
    '31x Copa del Rey',
    '3x FIFA Club World Cup',
  ];

  return (
    <div className="about-card">
      <div className="about-card__header">
        <span className="about-card__title">ABOUT {team?.name?.toUpperCase() ?? 'CLUB'}</span>
      </div>

      <div className="about-card__body">
        <p className="about-card__text">
          Founded in {team?.founded ?? 1899}, {team?.name ?? 'FC Barcelona'} is one of European football&rsquo;s most prestigious clubs, playing home fixtures at {team?.stadium ?? 'Spotify Camp Nou'} (capacity {team?.capacity ?? '99,354'}). Managed by {team?.manager ?? 'Hansi Flick'}, the club competes in {team?.league ?? 'La Liga'} and international European competitions.
        </p>

        {expanded && (
          <div className="about-card__expanded">
            <h4 className="about-card__subheading">Major Honours</h4>
            <div className="about-card__honours-grid">
              {honoursList.map((h, idx) => (
                <div key={idx} className="about-card__honour-pill">
                  <span className="about-card__honour-icon">🏆</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
            <p className="about-card__text" style={{ marginTop: '12px' }}>
              The club operates on a socio-owned membership model and is renowned for its world-famous La Masia youth academy, which has developed global football legends.
            </p>
          </div>
        )}

        <button
          type="button"
          className="about-card__toggle-btn"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Show Less ↑' : 'Read More ↓'}
        </button>
      </div>
    </div>
  );
}
