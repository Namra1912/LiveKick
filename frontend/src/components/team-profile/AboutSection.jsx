// src/components/team-profile/AboutSection.jsx
import { useState } from 'react';
import './AboutSection.css';

// Progressive opacity fade: most important stat reads at full contrast,
// subsequent lines step down to create visual reading hierarchy.
const OPACITY_MAP = [1.0, 0.85, 0.65, 0.45];

function getOpacity(index) {
  return OPACITY_MAP[index] ?? 0.35;
}

export default function AboutSection({ team }) {
  const [expanded, setExpanded] = useState(false);

  const about = team?.about;

  // Graceful fallback: if no structured data, render nothing
  if (!about?.bio && !about?.statLines?.length) return null;

  const statLines = about?.statLines ?? [];
  const visibleStats = expanded ? statLines : statLines.slice(0, 2);
  const hasMore = statLines.length > 2;

  return (
    <div className="about-card">
      <section className="about-section">
        <h2 className="about-section__heading">About</h2>

        {about?.bio && (
          <p className="about-section__bio">{about.bio}</p>
        )}

        {statLines.length > 0 && (
          <div className={`about-stats-mask${expanded ? ' is-expanded' : ''}`}>
            <div
              className={`about-section__stats${expanded ? ' about-section__stats--expanded' : ''}`}
            >
              {visibleStats.map((line, index) => (
                <p
                  key={line.id}
                  className="about-section__stat-line"
                  style={{ opacity: getOpacity(index) }}
                >
                  {line.parts.map((part, i) =>
                    part.isPlayer ? (
                      <span key={i} className="about-section__player-name">
                        {part.text}
                      </span>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </p>
              ))}
            </div>
          </div>
        )}

        {hasMore && (
          <button
            type="button"
            className="about-section__toggle"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? 'Show Less' : 'Expand'}
          </button>
        )}
      </section>
    </div>
  );
}
