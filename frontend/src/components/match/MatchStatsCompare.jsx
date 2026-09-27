// src/components/match/MatchStatsCompare.jsx
import { Disc3, Target, Crosshair, Zap, Flag, ShieldAlert, ArrowUpRight, CheckCircle2, Shield, Square, Radar, Hand, Swords } from 'lucide-react';
import './MatchStatsCompare.css';

// Possession stays the one hero stat with a bar — everything else uses a
// pill on whichever side leads, grouped under section headers. Matches the
// reference's own pattern: a bar draws the eye once, not on every row.
const POSSESSION_ROW = { home: 'possessionHome', away: 'possessionAway', label: 'Possession', suffix: '%', icon: Disc3 };

const STAT_GROUPS = [
  {
    title: 'Attacking',
    icon: Target,
    rows: [
      { home: 'xGHome', away: 'xGAway', label: 'Expected Goals (xG)', icon: Radar, decimals: 2 },
      { home: 'shotsHome', away: 'shotsAway', label: 'Total Shots', icon: Target },
      { home: 'shotsOnTargetHome', away: 'shotsOnTargetAway', label: 'Shots on Target', icon: Crosshair },
      { home: 'bigChancesHome', away: 'bigChancesAway', label: 'Big Chances', icon: Zap },
      { home: 'touchesInBoxHome', away: 'touchesInBoxAway', label: 'Touches in Box', icon: Hand },
      { home: 'cornersHome', away: 'cornersAway', label: 'Corners', icon: Flag },
    ],
  },
  {
    title: 'Passing',
    icon: CheckCircle2,
    rows: [
      { home: 'passAccuracyHome', away: 'passAccuracyAway', label: 'Pass Accuracy', suffix: '%', icon: CheckCircle2 },
    ],
  },
  {
    title: 'Defense & Duels',
    icon: Shield,
    rows: [
      { home: 'tacklesHome', away: 'tacklesAway', label: 'Tackles', icon: Shield },
      { home: 'interceptionsHome', away: 'interceptionsAway', label: 'Interceptions', icon: Shield },
      { home: 'clearancesHome', away: 'clearancesAway', label: 'Clearances', icon: Shield },
      { home: 'duelsWonHome', away: 'duelsWonAway', label: 'Duels Won', icon: Swords },
      { home: 'aerialDuelsWonHome', away: 'aerialDuelsWonAway', label: 'Aerial Duels Won', icon: Swords },
    ],
  },
  {
    title: 'Discipline',
    icon: ShieldAlert,
    rows: [
      { home: 'foulsHome', away: 'foulsAway', label: 'Fouls', icon: ShieldAlert },
      { home: 'offsidesHome', away: 'offsidesAway', label: 'Offsides', icon: ArrowUpRight },
      { home: 'yellowCardsHome', away: 'yellowCardsAway', label: 'Yellow Cards', icon: Square },
    ],
  },
];

function StatValue({ value, suffix, isWinner, color, align }) {
  return (
    <span
      className={`match-stat-value match-stat-value--${align} ${isWinner ? 'match-stat-value--lead' : ''}`}
      style={{ color: isWinner ? color : undefined }}
    >
      {value}{suffix ?? ''}
    </span>
  );
}

// Every row carries its own proportion bar — the share each side holds of
// this particular stat, not just a pill on whichever number is bigger.
// Percentage-suffixed stats (already 0-100) use their own value directly;
// everything else is normalized against the row's home+away total.
function StatRow({ row, stats, homeColor, awayColor }) {
  const rawHome = stats[row.home];
  const rawAway = stats[row.away];
  if (rawHome == null || rawAway == null) return null;
  const homeVal = row.decimals != null ? rawHome.toFixed(row.decimals) : rawHome;
  const awayVal = row.decimals != null ? rawAway.toFixed(row.decimals) : rawAway;
  const Icon = row.icon;
  const homeWins = rawHome > rawAway;
  const awayWins = rawAway > rawHome;

  const isPercent = row.suffix === '%';
  const total = rawHome + rawAway;
  const homePct = isPercent ? Math.min(100, rawHome) : total > 0 ? (rawHome / total) * 100 : 50;
  const awayPct = isPercent ? Math.min(100, rawAway) : 100 - homePct;

  return (
    <div className="match-stat-row">
      <div className="match-stat-row__values">
        <StatValue value={homeVal} suffix={row.suffix} isWinner={homeWins} color={homeColor} align="home" />
        <span className="match-stat-row__label">
          {Icon && <Icon size={12} strokeWidth={2} className="match-stat-row__icon" />}
          {row.label}
        </span>
        <StatValue value={awayVal} suffix={row.suffix} isWinner={awayWins} color={awayColor} align="away" />
      </div>
      <div className="match-stat-row__bar">
        <span className="match-stat-row__bar-home" style={{ width: `${homePct}%`, backgroundColor: homeColor }} />
        <span className="match-stat-row__bar-away" style={{ width: `${awayPct}%`, backgroundColor: awayColor }} />
      </div>
    </div>
  );
}

export default function MatchStatsCompare({ stats, homeColor, awayColor, limit }) {
  if (!stats) {
    return <p className="match-stats-compare__empty">Match stats haven&apos;t been recorded yet.</p>;
  }

  // Teaser mode (Overview tab): possession bar + first group only, no
  // section headers — keeps the Overview card short.
  if (limit) {
    const teaserRows = STAT_GROUPS.flatMap((g) => g.rows).slice(0, limit);
    return (
      <div className="match-stats-compare">
        <PossessionBar stats={stats} homeColor={homeColor} awayColor={awayColor} />
        {teaserRows.map((row) => (
          <StatRow key={row.label} row={row} stats={stats} homeColor={homeColor} awayColor={awayColor} />
        ))}
      </div>
    );
  }

  return (
    <div className="match-stats-compare">
      <PossessionBar stats={stats} homeColor={homeColor} awayColor={awayColor} />
      {STAT_GROUPS.map((group) => {
        const visibleRows = group.rows.filter((r) => stats[r.home] != null && stats[r.away] != null);
        if (visibleRows.length === 0) return null;
        const GroupIcon = group.icon;
        return (
          <div className="match-stats-compare__group" key={group.title}>
            <h3 className="match-stats-compare__group-title">
              {GroupIcon && <GroupIcon size={13} strokeWidth={2} />}
              {group.title}
            </h3>
            {visibleRows.map((row) => (
              <StatRow key={row.label} row={row} stats={stats} homeColor={homeColor} awayColor={awayColor} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function PossessionBar({ stats, homeColor, awayColor }) {
  const homeVal = stats[POSSESSION_ROW.home];
  const awayVal = stats[POSSESSION_ROW.away];
  if (homeVal == null || awayVal == null) return null;
  const homeLeads = homeVal > awayVal;

  return (
    <div className="match-possession">
      <span className="match-possession__label">
        <Disc3 size={12} strokeWidth={2} className="match-stat-row__icon" /> Ball Possession
      </span>
      <div className="match-possession__pills">
        <span
          className={`match-possession__pill ${homeLeads ? 'match-possession__pill--lead' : ''}`}
          style={{ flexGrow: homeVal, backgroundColor: homeLeads ? homeColor : undefined, color: homeLeads ? '#080c11' : homeColor }}
        >
          {homeVal}%
        </span>
        <span
          className={`match-possession__pill ${!homeLeads ? 'match-possession__pill--lead' : ''}`}
          style={{ flexGrow: awayVal, backgroundColor: !homeLeads ? awayColor : undefined, color: !homeLeads ? '#080c11' : awayColor }}
        >
          {awayVal}%
        </span>
      </div>
    </div>
  );
}
