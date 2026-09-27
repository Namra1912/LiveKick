// src/components/match/MatchStatsCompare.jsx
import { Disc3, Target, Crosshair, Zap, Flag, ShieldAlert, ArrowUpRight, CheckCircle2, Shield, Square } from 'lucide-react';
import './MatchStatsCompare.css';

const STAT_ROWS = [
  { home: 'possessionHome', away: 'possessionAway', label: 'Possession', suffix: '%', icon: Disc3 },
  { home: 'shotsHome', away: 'shotsAway', label: 'Total Shots', icon: Target },
  { home: 'shotsOnTargetHome', away: 'shotsOnTargetAway', label: 'Shots on Target', icon: Crosshair },
  { home: 'bigChancesHome', away: 'bigChancesAway', label: 'Big Chances', icon: Zap },
  { home: 'cornersHome', away: 'cornersAway', label: 'Corners', icon: Flag },
  { home: 'passAccuracyHome', away: 'passAccuracyAway', label: 'Pass Accuracy', suffix: '%', icon: CheckCircle2 },
  { home: 'tacklesHome', away: 'tacklesAway', label: 'Tackles', icon: Shield },
  { home: 'foulsHome', away: 'foulsAway', label: 'Fouls', icon: ShieldAlert },
  { home: 'offsidesHome', away: 'offsidesAway', label: 'Offsides', icon: ArrowUpRight },
  { home: 'yellowCardsHome', away: 'yellowCardsAway', label: 'Yellow Cards', icon: Square },
];

export default function MatchStatsCompare({ stats, homeColor, awayColor, limit }) {
  if (!stats) {
    return <p className="match-stats-compare__empty">Match stats haven&apos;t been recorded yet.</p>;
  }

  const rows = limit ? STAT_ROWS.slice(0, limit) : STAT_ROWS;

  return (
    <div className="match-stats-compare">
      {rows.map((row) => {
        const homeVal = stats[row.home];
        const awayVal = stats[row.away];
        if (homeVal == null || awayVal == null) return null;
        const total = homeVal + awayVal || 1;
        const homePct = (homeVal / total) * 100;
        const Icon = row.icon;
        return (
          <div className="match-stat-row" key={row.label}>
            <div className="match-stat-row__top">
              <span className="match-stat-row__value" style={{ color: homeColor }}>
                {homeVal}{row.suffix ?? ''}
              </span>
              <span className="match-stat-row__label">
                {Icon && <Icon size={12} strokeWidth={2} className="match-stat-row__icon" />}
                {row.label}
              </span>
              <span className="match-stat-row__value match-stat-row__value--away" style={{ color: awayColor }}>
                {awayVal}{row.suffix ?? ''}
              </span>
            </div>
            <div className="match-stat-row__bar">
              <span className="match-stat-row__bar-home" style={{ width: `${homePct}%`, backgroundColor: homeColor }} />
              <span className="match-stat-row__bar-away" style={{ width: `${100 - homePct}%`, backgroundColor: awayColor }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
