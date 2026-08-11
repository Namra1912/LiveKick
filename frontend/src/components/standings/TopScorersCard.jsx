// src/components/standings/TopScorersCard.jsx
//
// ── DELIVERABLE AUDIT FOR TOP SCORERS CARD ────────────────────────────────────
// 1. DATA SHAPE READ FROM MOCKDATA.JS `topScorers`:
//    topScorers[leagueName] -> Array of 5 objects:
//    { rank, name, team, goals, matches, playerPhotoUrl }
//    - `rank`: number (1..5)
//    - `name`: string (e.g. "Mohamed Salah")
//    - `team`: team object { id, name, shortName, logoUrl, crestUrl }
//    - `goals`: number (e.g. 19)
//
// 2. PRIMARY STYLING REFERENCE:
//    PredictorCard.jsx & NewsList.jsx right-panel card chrome:
//    - Outer rim border + --shadow-inset + --shadow-card, --radius-card
//    - Header row with uppercase 11px Inter title + elevated background
//    - Compact row density matching sports-data scanning format
//
// 3. TYPOGRAPHY RULES:
//    - Rank & Goals: JetBrains Mono (--font-mono), 700 weight for key stat
//    - Player Name & Team Name: Inter (--font-body), --color-primary & --color-secondary
//
// 4. BANNED ELEMENTS CHECK:
//    - NO gold/coin token (--color-gold) used anywhere (gold reserved for currency).
//    - NO missing photo placeholders — uses rank badge as leading visual.
// ══════════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import Crest from '../shared/Crest';
import { topScorers } from '../../data/mockData';
import './TopScorersCard.css';

export default function TopScorersCard({ league }) {
  const leagueName = league?.name ?? 'Premier League';
  const scorers = useMemo(() => topScorers[leagueName] ?? [], [leagueName]);

  return (
    <article className="top-stats-card" aria-label={`Top Scorers for ${leagueName}`}>
      {/* Header */}
      <div className="top-stats-card__header">
        <span className="top-stats-card__title">Top Scorers</span>
        <span className="top-stats-card__subtitle">Goals</span>
      </div>

      {/* Rows */}
      <div className="top-stats-card__list">
        {scorers.length === 0 ? (
          <div className="top-stats-card__empty">No scorer data available</div>
        ) : (
          scorers.map((item, idx) => (
            <div
              key={item.rank || idx}
              className={`top-stats-card__row${idx === scorers.length - 1 ? ' top-stats-card__row--last' : ''}`}
            >
              {/* Rank Badge */}
              <span className="top-stats-card__rank">{item.rank}</span>

              {/* Player & Team Info */}
              <div className="top-stats-card__player-info">
                <span className="top-stats-card__player-name">{item.name}</span>
                <div className="top-stats-card__team-info">
                  <Crest team={item.team} name={item.team?.name} size={18} />
                  <span className="top-stats-card__team-name">{item.team?.name || 'Team'}</span>
                </div>
              </div>


              {/* Goals Count (JetBrains Mono) */}
              <div className="top-stats-card__stat-wrap">
                <span className="top-stats-card__stat-value">{item.goals}</span>
                <span className="top-stats-card__stat-label">goals</span>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
