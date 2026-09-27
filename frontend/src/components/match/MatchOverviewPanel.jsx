// src/components/match/MatchOverviewPanel.jsx
// The Overview tab's stat shell: Momentum sparkline + Top Stats side by
// side in one card, matching the reference's Facts-tab layout — separate
// from MatchReviewCard, which carries the article link above it.
import { Disc3, Target, Crosshair, Radar, ArrowRight } from 'lucide-react';
import { matchMomentum } from '../../data/mockData';
import './MatchStatsCompare.css';
import './MatchOverviewPanel.css';

// Quadratic-through-midpoints smoothing: turns the raw per-minute readings
// into one continuous ridge line (each segment curves through the midpoint
// of its neighbors) instead of sharp linear spikes between sparse points.
function smoothAreaPath(points, w, h, mid, scale) {
  const step = w / (points.length - 1);
  const coords = points.map((v, i) => [i * step, mid - v * scale]);

  let d = `M ${coords[0][0].toFixed(1)} ${coords[0][1].toFixed(1)}`;
  for (let i = 1; i < coords.length; i++) {
    const [cx, cy] = coords[i - 1];
    const [x, y] = coords[i];
    const mx = (cx + x) / 2;
    const my = (cy + y) / 2;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const [lx, ly] = coords[coords.length - 1];
  d += ` L ${lx.toFixed(1)} ${ly.toFixed(1)}`;
  d += ` L ${w} ${mid} L 0 ${mid} Z`;
  return d;
}

function Momentum({ match, homeColor, awayColor }) {
  const points = matchMomentum[match.id];
  if (!points) return null;

  const w = 280;
  const h = 110;
  const mid = h / 2;
  const scale = mid / 70; // clamp visual amplitude
  const areaPath = smoothAreaPath(points, w, h, mid, scale);

  return (
    <div className="match-overview__momentum">
      <h3 className="match-overview__col-title">Momentum</h3>
      <svg viewBox={`0 0 ${w} ${h}`} className="match-overview__momentum-chart" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`momentum-home-${match.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={homeColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={homeColor} stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={`momentum-away-${match.id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={awayColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={awayColor} stopOpacity="0.35" />
          </linearGradient>
          <clipPath id={`momentum-clip-top-${match.id}`}>
            <rect x="0" y="0" width={w} height={mid} />
          </clipPath>
          <clipPath id={`momentum-clip-bottom-${match.id}`}>
            <rect x="0" y={mid} width={w} height={mid} />
          </clipPath>
        </defs>
        <line x1={w / 2} y1="0" x2={w / 2} y2={h} className="match-overview__momentum-ht" />
        <path d={areaPath} fill={`url(#momentum-home-${match.id})`} clipPath={`url(#momentum-clip-top-${match.id})`} />
        <path d={areaPath} fill={`url(#momentum-away-${match.id})`} clipPath={`url(#momentum-clip-bottom-${match.id})`} />
        <line x1="0" y1={mid} x2={w} y2={mid} className="match-overview__momentum-zero" />
      </svg>
      <div className="match-overview__momentum-labels">
        <span>0&apos;</span>
        <span>HT</span>
        <span>FT</span>
      </div>
    </div>
  );
}

function TopStatRow({ icon: Icon, label, homeVal, awayVal, homeColor, awayColor, suffix = '' }) {
  if (homeVal == null || awayVal == null) return null;
  const homeLeads = homeVal >= awayVal;
  return (
    <div className="match-overview__stat-row">
      <span className="match-overview__stat-num" style={homeLeads ? { color: homeColor } : undefined}>
        {homeVal}{suffix}
      </span>
      <span className="match-overview__stat-label">
        {Icon && <Icon size={12} strokeWidth={2} />} {label}
      </span>
      <span
        className={`match-overview__stat-num match-overview__stat-num--pill ${!homeLeads ? 'match-overview__stat-num--lead' : ''}`}
        style={!homeLeads ? { backgroundColor: awayColor } : { color: awayColor }}
      >
        {awayVal}{suffix}
      </span>
    </div>
  );
}

export default function MatchOverviewPanel({ stats, match, homeColor, awayColor, onViewAllStats }) {
  if (!stats) {
    return <p className="match-stats-compare__empty">Match stats haven&apos;t been recorded yet.</p>;
  }
  const homeLeadsPoss = stats.possessionHome >= stats.possessionAway;

  return (
    <div>
      <div className="match-overview">
        <Momentum match={match} homeColor={homeColor} awayColor={awayColor} />

        <div className="match-overview__stats">
          <h3 className="match-overview__col-title">Top Stats</h3>

          <div className="match-overview__possession">
            <span className="match-overview__possession-label">
              <Disc3 size={12} strokeWidth={2} /> Ball Possession
            </span>
            <div className="match-possession__pills">
              <span
                className={`match-possession__pill ${homeLeadsPoss ? 'match-possession__pill--lead' : ''}`}
                style={{ flexGrow: stats.possessionHome, backgroundColor: homeLeadsPoss ? homeColor : undefined, color: homeLeadsPoss ? '#080c11' : homeColor }}
              >
                {stats.possessionHome}%
              </span>
              <span
                className={`match-possession__pill ${!homeLeadsPoss ? 'match-possession__pill--lead' : ''}`}
                style={{ flexGrow: stats.possessionAway, backgroundColor: !homeLeadsPoss ? awayColor : undefined, color: !homeLeadsPoss ? '#080c11' : awayColor }}
              >
                {stats.possessionAway}%
              </span>
            </div>
          </div>

          <TopStatRow icon={Radar} label="Expected Goals (xG)" homeVal={stats.xGHome} awayVal={stats.xGAway} homeColor={homeColor} awayColor={awayColor} />
          <TopStatRow icon={Target} label="Total Shots" homeVal={stats.shotsHome} awayVal={stats.shotsAway} homeColor={homeColor} awayColor={awayColor} />
          <TopStatRow icon={Crosshair} label="Touches in Box" homeVal={stats.touchesInBoxHome} awayVal={stats.touchesInBoxAway} homeColor={homeColor} awayColor={awayColor} />
        </div>
      </div>

      {onViewAllStats && (
        <button type="button" className="match-overview__all-stats" onClick={onViewAllStats}>
          All Stats <ArrowRight size={14} strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}
