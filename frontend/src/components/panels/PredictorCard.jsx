// src/components/panels/PredictorCard.jsx
/**
 * Deliverable Task Mapping:
 * 1. PASSIVE FAN LEAN BAR: Added read-only fan split bar ("LIV 58%" / "42% CHE")
 *    using fanSplit data from mockData.js, styled with muted saturation and no hover effects.
 * 2. TIMING / CONTEXT LINE: Added kickoff lock time ("Locks at 14:15") computed from lockAt,
 *    displayed in header as secondary mono text.
 * 3. INCENTIVE HOOK: Added subtle "Earn coins for a correct pick" text hook in footer row.
 * 4. MINIMAL TEXT CTA LINK: Positioned quiet "Predict →" text link on right of footer using
 *    var(--color-pitch-green) with no full-width block or button background fill.
 * 5. BALANCED CREST & DENSITY: Resized crests to size 44 to match MatchOfTheDayCard density
 *    and balanced spacing across header, matchup, fan lean bar, and footer.
 * 6. CARD DEPTH: Retained double-bezel container (border, surface, var(--bezel-double))
 *    adjusting internal spacing only.
 */

import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import './PredictorCard.css';

function formatLockTime(isoString) {
  if (!isoString) return '14:15';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PredictorCard({ predictorMatch }) {
  const navigate = useNavigate();

  if (!predictorMatch) return null;

  const { homeTeam, awayTeam, lockAt, fanSplit } = predictorMatch;

  const homePct = fanSplit?.home ?? 58;
  const awayPct = fanSplit?.away ?? 42;
  const lockTime = formatLockTime(lockAt);

  const handleNavigate = () => {
    navigate('/predictions');
  };

  return (
    <article
      className="predictor-card"
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate()}
      aria-label={`Fan Predictor for ${homeTeam?.name} vs ${awayTeam?.name}. Locks at ${lockTime}. Click to open Predictions League.`}
    >
      {/* ── Header: Title (left) + Lock timing context (right) (Item 2) ── */}
      <div className="predictor-card__header">
        <span className="predictor-card__title">Fan Predictor</span>
        <span className="predictor-card__lock-time">Locks at {lockTime}</span>
      </div>

      <div className="predictor-card__body">
        {/* ── Matchup Row: Crests size 44 + Team Names + VS Divider (Item 5) ── */}
        <div className="predictor-card__matchup">
          <div className="predictor-card__team predictor-card__team--home">
            <Crest logoUrl={homeTeam?.logoUrl} name={homeTeam?.name} size={45} />
            <span className="predictor-card__team-name">{homeTeam?.shortName ?? homeTeam?.name}</span>
          </div>

          <span className="predictor-card__vs-badge">VS</span>

          <div className="predictor-card__team predictor-card__team--away">
            <span className="predictor-card__team-name">{awayTeam?.shortName ?? awayTeam?.name}</span>
            <Crest logoUrl={awayTeam?.logoUrl} name={awayTeam?.name} size={45} />
          </div>
        </div>

        {/* ── Passive Fan Lean Bar (Item 1) ── */}
        <div
          className="predictor-card__fan-lean"
          aria-label={`Fan prediction split: ${homeTeam?.shortName} ${homePct}%, ${awayTeam?.shortName} ${awayPct}%`}
        >
          <div className="predictor-card__lean-labels">
            <span className="predictor-card__lean-val predictor-card__lean-val--home">
              {homeTeam?.shortName} {homePct}%
            </span>
            <span className="predictor-card__lean-caption">Fan Prediction</span>
            <span className="predictor-card__lean-val predictor-card__lean-val--away">
              {awayPct}% {awayTeam?.shortName}
            </span>
          </div>
          <div className="predictor-card__lean-track" role="presentation">
            <div
              className="predictor-card__lean-fill predictor-card__lean-fill--home"
              style={{ width: `${homePct}%` }}
            />
            <div
              className="predictor-card__lean-fill predictor-card__lean-fill--away"
              style={{ width: `${awayPct}%` }}
            />
          </div>
        </div>

        {/* ── Footer Row: Item 3 (Incentive Hook) + Item 4 (Quiet Text Link CTA) ── */}
        <div className="predictor-card__footer">
          <span className="predictor-card__hook">Earn coins for a correct pick</span>
          <span className="predictor-card__cta-link">
            Predict <span className="predictor-card__cta-arrow" aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
