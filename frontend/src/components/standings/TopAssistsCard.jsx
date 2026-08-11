// src/components/standings/TopAssistsCard.jsx
//
// ── DELIVERABLE AUDIT FOR TOP ASSISTS CARD ────────────────────────────────────
// 1. DATA SHAPE READ FROM MOCKDATA.JS `topAssists`:
//    topAssists[leagueName] -> Array of 5 objects:
//    { rank, name, team, assists, matches, playerPhotoUrl }
//    - `rank`: number (1..5)
//    - `name`: string (e.g. "Bukayo Saka")
//    - `team`: team object { id, name, shortName, logoUrl, crestUrl }
//    - `assists`: number (e.g. 12)
//
// 2. PRIMARY STYLING REFERENCE:
//    PredictorCard.jsx & NewsList.jsx right-panel card chrome:
//    - Outer rim border + --shadow-inset + --shadow-card, --radius-card
//    - Header row with uppercase 11px Inter title + elevated background
//    - Compact row density matching sports-data scanning format
//
// 3. TYPOGRAPHY RULES:
//    - Rank & Assists: JetBrains Mono (--font-mono), 700 weight for key stat
//    - Player Name & Team Name: Inter (--font-body), --color-primary & --color-secondary
//
// 4. BANNED ELEMENTS CHECK:
//    - NO gold/coin token (--color-gold) used anywhere (gold reserved for currency).
//    - NO missing photo placeholders — uses rank badge as leading visual.
// ══════════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import Crest from '../shared/Crest';
import { topAssists } from '../../data/mockData';
import './TopAssistsCard.css';

export default function TopAssistsCard({ league }) {
  const leagueName = league?.name ?? 'Premier League';
  const assistsList = useMemo(() => topAssists[leagueName] ?? [], [leagueName]);

  return (
    <article className="top-stats-card" aria-label={`Top Assists for ${leagueName}`}>
      {/* Header */}
      <div className="top-stats-card__header">
        <span className="top-stats-card__title">Top Assists</span>
        <span className="top-stats-card__subtitle">Assists</span>
      </div>

      {/* Rows */}
      <div className="top-stats-card__list">
        {assistsList.length === 0 ? (
          <div className="top-stats-card__empty">No assist data available</div>
        ) : (
          assistsList.map((item, idx) => (
            <div
              key={item.rank || idx}
              className={`top-stats-card__row${idx === assistsList.length - 1 ? ' top-stats-card__row--last' : ''}`}
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


              {/* Assists Count (JetBrains Mono) */}
              <div className="top-stats-card__stat-wrap">
                <span className="top-stats-card__stat-value">{item.assists}</span>
                <span className="top-stats-card__stat-label">ast</span>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
