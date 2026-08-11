// src/components/standings/StandingsTable.jsx
//
// ══════════════════════════════════════════════════════════════════════════════
// DELIVERABLE AUDIT — Required answers for Chunk 4
// ══════════════════════════════════════════════════════════════════════════════
// 1. ZONE COLOR TOKENS USED (from tokens.css):
//    - Champions League / Auto-Qualify (1-4 / CL 1-8): var(--color-pitch-green) (#00B370)
//    - Europa League (Pos 5) & CL Playoff Round (CL 9-24): var(--color-info-blue) (#3b82f6)
//    - Conference League (Pos 6): var(--color-star) (#eab308)
//    - Relegation (Pos 18-20): var(--color-live-red) (#f87171)
//    - Bundesliga Playoff (Pos 16): Folded into relegation strip (var(--color-live-red))
//      because tokens.css does not define a 4th distinct non-currency token (gold is reserved
//      exclusively for Matchday Coins). As instructed by spec, pos 16 is folded into relegation.
//
// 2. ROW DENSITY / PADDING (pulled from MatchRow.css):
//    - Padding: var(--space-3) var(--space-3) (12px 12px) per cell, padding-left 16px on pos/club
//    - Row height: ~44px dense sports table baseline
//
// 3. EXACT FIELD NAMES READ FROM MOCKDATA.JS STANDINGS OBJECT:
//    - `position` (number: 1..36)
//    - `team` (object: { id, name, shortName, logoUrl, crestUrl })
//    - `played` (number)
//    - `won` / `w` (number)
//    - `drawn` / `d` (number)
//    - `lost` / `l` (number)
//    - `goalDifference` / `gd` (number)
//    - `points` / `pts` (number)
//    - `form` (array of 5 strings: e.g. ["W", "W", "D", "L", "W"])
//
// 4. ACTIVE LEAGUE CONSUMPTION FROM STANDINGS.JSX:
//    - Consumed via prop: `league={activeLeague}`
//    - `activeLeague` is derived directly from `LEAGUE_BY_SLUG[resolvedSlug]` in Standings.jsx.
//    - Zero parallel state introduced.
//
// 5. RESPONSIVE PATTERN (sourced from MatchRow/LeagueGroup):
//    - Horizontal scroll container (`overflow-x: auto`) wrapping the double-bezel card.
//    - Ensures no column clipping or awkward text truncations on mobile screens.
// ══════════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import StandingsRow from './StandingsRow';
import Crest from '../shared/Crest';
import { standings } from '../../data/mockData';
import './StandingsTable.css';

export default function StandingsTable({ league }) {
  const leagueName = league?.name ?? 'Premier League';
  const tableData = useMemo(() => standings[leagueName] ?? [], [leagueName]);

  return (
    <div className="standings-table__wrapper">
      {/* League Header Banner inside table card */}
      <div className="standings-table__banner">
        <div className="standings-table__banner-left">
          <Crest logoUrl={league?.logoUrl} name={leagueName} size={28} />
          <div className="standings-table__banner-title-group">
            <h2 className="standings-table__banner-title">{leagueName}</h2>
            <span className="standings-table__banner-sub">
              Matchday {league?.matchday ?? 1} • {tableData.length} Teams
            </span>
          </div>
        </div>

        {/* Legend strip indicators */}
        <div className="standings-table__legend" aria-label="Zone legend">
          <span className="standings-table__legend-item">
            <span className="standings-table__legend-dot standings-table__legend-dot--ucl" />
            UCL
          </span>
          <span className="standings-table__legend-item">
            <span className="standings-table__legend-dot standings-table__legend-dot--uel" />
            UEL
          </span>
          {leagueName !== 'Champions League' && (
            <span className="standings-table__legend-item">
              <span className="standings-table__legend-dot standings-table__legend-dot--uecl" />
              UECL
            </span>
          )}
          <span className="standings-table__legend-item">
            <span className="standings-table__legend-dot standings-table__legend-dot--rel" />
            {leagueName === 'Champions League' ? 'Eliminated' : 'Relegation'}
          </span>
        </div>
      </div>

      {/* Main Table Container with Double-Bezel Card Frame */}
      <div className="standings-table__card">
        <div className="standings-table__scroll-container">
          <table className="standings-table__grid">
            <thead>
              <tr className="standings-table__header-row">
                <th className="standings-table__th standings-table__th--pos">#</th>
                <th className="standings-table__th standings-table__th--club">CLUB</th>
                <th className="standings-table__th standings-table__th--num">P</th>
                <th className="standings-table__th standings-table__th--num">W</th>
                <th className="standings-table__th standings-table__th--num">D</th>
                <th className="standings-table__th standings-table__th--num">L</th>
                <th className="standings-table__th standings-table__th--num">GD</th>
                <th className="standings-table__th standings-table__th--num standings-table__th--pts">PTS</th>
                <th className="standings-table__th standings-table__th--form">FORM</th>
                <th className="standings-table__th standings-table__th--strip" aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <StandingsRow
                  key={row.team?.id || row.position || index}
                  rowData={row}
                  leagueName={leagueName}
                  isLastRow={index === tableData.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
