// src/components/standings/StandingsRow.jsx
//
// Individual row component in the Standings table.
//
// ── TYPOGRAPHY RULES APPLIED ──────────────────────────────────────────────────
// POS:   JetBrains Mono (--font-mono), right-aligned / centered tabular digit
// CLUB:  Inter (--font-body), regular/medium weight, left-aligned
// P/W/D/L/GD/PTS: JetBrains Mono (--font-mono), right-aligned, tabular figures
//        - GD shows explicit "+" prefix for positive numbers (e.g. "+14")
//        - PTS has font-weight: 700 (bold numeric emphasis)
// FORM:  5 small outcome badges (rightmost = most recent result)
//
// ── ZONE STRIP DEEP-DIVE ──────────────────────────────────────────────────────
// Thin 3px vertical accent bar on the RIGHT edge of the row.
// Colors mapped directly from tokens.css:
//   - Champions League / CL Auto-Qualify: var(--color-pitch-green)
//   - Europa League / CL Playoff (9-24):  var(--color-info-blue)
//   - Conference League:                  var(--color-star)
//   - Relegation & Bundesliga 16th:       var(--color-live-red)

import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import './StandingsRow.css';

export default function StandingsRow({ rowData, leagueName, isLastRow, isHighlighted }) {
  const navigate = useNavigate();
  const { position, team, played, won, drawn, lost, goalDifference, points, form } = rowData;

  // Format Goal Difference with explicit '+' prefix for positive values
  const formattedGd = goalDifference > 0 ? `+${goalDifference}` : `${goalDifference}`;

  // Determine qualification/relegation zone strip class based on league format
  const getZoneClass = () => {
    if (leagueName === 'Champions League') {
      if (position >= 1 && position <= 8) return 'standings-row__zone--ucl';
      if (position >= 9 && position <= 24) return 'standings-row__zone--cl-playoff';
      return 'standings-row__zone--none'; // Positions 25-36 have transparent strip
    }

    if (leagueName === 'Bundesliga') {
      if (position >= 1 && position <= 4) return 'standings-row__zone--ucl';
      if (position === 5) return 'standings-row__zone--uel';
      if (position === 6) return 'standings-row__zone--uecl';
      if (position >= 16) return 'standings-row__zone--relegation'; // Pos 16 folded into relegation
      return 'standings-row__zone--none';
    }

    // Standard 20-team domestic leagues (Premier League, La Liga, Serie A)
    if (position >= 1 && position <= 4) return 'standings-row__zone--ucl';
    if (position === 5) return 'standings-row__zone--uel';
    if (position === 6) return 'standings-row__zone--uecl';
    if (position >= 18) return 'standings-row__zone--relegation';
    return 'standings-row__zone--none';
  };

  const rowClasses = [
    'standings-row',
    isLastRow ? 'standings-row--last' : '',
    isHighlighted ? 'standings-row--highlighted' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr className={rowClasses}>
      {/* POS */}
      <td className="standings-row__cell standings-row__cell--pos">
        {position}
      </td>

      {/* CLUB */}
      <td className="standings-row__cell standings-row__cell--club">
        <div
          className="standings-row__club-wrap"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            if (team?.id) navigate(`/teams/${team.id}`);
          }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && team?.id) {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/teams/${team.id}`);
            }
          }}
          title={`View ${team?.name} profile`}
        >
          <Crest logoUrl={team?.logoUrl} name={team?.name} size={24} />
          <span className="standings-row__team-name">{team?.name}</span>
        </div>
      </td>

      {/* P */}
      <td className="standings-row__cell standings-row__cell--num">
        {played}
      </td>

      {/* W */}
      <td className="standings-row__cell standings-row__cell--num">
        {won}
      </td>

      {/* D */}
      <td className="standings-row__cell standings-row__cell--num">
        {drawn}
      </td>

      {/* L */}
      <td className="standings-row__cell standings-row__cell--num">
        {lost}
      </td>

      {/* GD */}
      <td className="standings-row__cell standings-row__cell--num standings-row__cell--gd">
        {formattedGd}
      </td>

      {/* PTS */}
      <td className="standings-row__cell standings-row__cell--num standings-row__cell--pts">
        {points}
      </td>

      {/* FORM */}
      <td className="standings-row__cell standings-row__cell--form">
        <div className="standings-row__form-wrap">
          {Array.isArray(form) &&
            form.map((res, i) => (
              <span
                key={i}
                className={`standings-row__form-badge standings-row__form-badge--${res.toLowerCase()}`}
                title={`Match result: ${res}`}
              >
                {res}
              </span>
            ))}
        </div>
      </td>

      {/* ZONE STRIP (Right edge vertical accent bar) */}
      <td className={`standings-row__zone ${getZoneClass()}`} aria-hidden="true" />
    </tr>
  );
}
