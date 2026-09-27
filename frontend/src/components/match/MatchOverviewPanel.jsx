// src/components/match/MatchOverviewPanel.jsx
// The Overview tab's stat shell: Momentum sparkline + Top Stats side by
// side in one card, matching the reference's Facts-tab layout — separate
// from MatchReviewCard, which carries the article link above it.
import { Disc3, Target, Crosshair, Radar } from 'lucide-react';
import { matchMomentum } from '../../data/mockData';
import './MatchStatsCompare.css';
import './MatchOverviewPanel.css';

function Momentum({ match, homeColor, awayColor }) {
  const points = matchMomentum[match.id];
  if (!points) return null;

  const w = 280;
  const h = 110;
  const mid = h / 2;
  const step = w / (points.length - 1);
  const scale = mid / 70; // clamp visual amplitude

  const path = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)} ${(mid - v * scale).toFixed(1)}`)
    .join(' ');
  const areaPath = `${path} L ${w} ${mid} L 0 ${mid} Z`;

  return (
    <div className="match-overview__momentum">
      <h3 className="match-overview__col-title">Momentum</h3>
      <svg viewBox={`0 0 ${w} ${h}`} className="match-overview__momentum-chart" preserveAspectRatio="none">
        <line x1={w / 2} y1="0" x2={w / 2} y2={h} className="match-overview__momentum-ht" />
        <line x1="0" y1={mid} x2={w} y2={mid} className="match-overview__momentum-zero" />
        <path d={areaPath} fill={homeColor} className="match-overview__momentum-area match-overview__momentum-area--home" />
        <path d={areaPath} fill={awayColor} className="match-overview__momentum-area match-overview__momentum-area--away" />
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

export default function MatchOverviewPanel({ stats, match, homeColor, awayColor }) {
  if (!stats) {
    return <p className="match-stats-compare__empty">Match stats haven&apos;t been recorded yet.</p>;
  }
  const homeLeadsPoss = stats.possessionHome >= stats.possessionAway;

  return (
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
  );
}
