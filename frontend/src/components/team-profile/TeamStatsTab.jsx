// src/components/team-profile/TeamStatsTab.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { teamStats as allTeamStats } from '../../data/mockData';
import { listItem } from '../../lib/motion';
import Flag from '../shared/Flag';
import './TeamStatsTab.css';

// Each metric's realistic ceiling — the bar fills relative to this, not to
// the highest value in the dataset, so a single team's page never implies
// a false 100% just because it's the only team with data.
const PERFORMANCE_METRICS = [
  { key: 'avgPossession', label: 'Avg. Possession', max: 100, suffix: '' },
  { key: 'shotsPerGame', label: 'Shots per Game', max: 20, suffix: '' },
  { key: 'passAccuracy', label: 'Pass Accuracy', max: 100, suffix: '' },
  { key: 'tacklesPerGame', label: 'Tackles per Game', max: 25, suffix: '' },
];

function parsePercent(val) {
  if (typeof val === 'number') return val;
  return parseFloat(val) || 0;
}

const POSITION_ORDER = { Coach: -1, GK: 0, CB: 1, RB: 1, LB: 1, RWB: 1, LWB: 1, DEF: 1, CDM: 2, CM: 2, AM: 2, LM: 2, RM: 2, MID: 2, ST: 3, CF: 3, LW: 3, RW: 3, FWD: 3 };
function positionRank(pos) {
  if (!pos) return 99;
  if (pos === 'Coach') return -1;
  return POSITION_ORDER[pos.split(',')[0].trim()] ?? 99;
}
function positionGroupClass(pos) {
  const rank = positionRank(pos);
  if (rank === -1) return 'stats-table__row--coach';
  if (rank === 0) return 'stats-table__row--gk';
  if (rank === 1) return 'stats-table__row--def';
  if (rank === 2) return 'stats-table__row--mid';
  if (rank === 3) return 'stats-table__row--fwd';
  return '';
}

export default function TeamStatsTab({ team, squad = [] }) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState('rating');
  const [sortDir, setSortDir] = useState('desc');

  const stats = allTeamStats[team?.id] ?? null;
  const outfieldSquad = useMemo(
    () => squad.filter((p) => !p.isCoach && p.position !== 'Coach'),
    [squad]
  );

  const sortedSquad = useMemo(() => {
    const rows = [...outfieldSquad];
    rows.sort((a, b) => {
      const va = a[sortKey] ?? -Infinity;
      const vb = b[sortKey] ?? -Infinity;
      return sortDir === 'desc' ? vb - va : va - vb;
    });
    return rows;
  }, [outfieldSquad, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  if (!stats && outfieldSquad.length === 0) {
    return (
      <section className="team-profile__content team-profile__content--centered">
        <div className="stub-page__panel" role="status">
          <div className="stub-page__icon">
            <BarChart3 size={22} strokeWidth={1.75} />
          </div>
          <h2 className="stub-page__heading">No Stats Recorded</h2>
          <p className="stub-page__body">Season stats for {team?.name} haven&apos;t been tracked yet.</p>
        </div>
      </section>
    );
  }

  const teamColor = team?.primaryColor || 'var(--color-pitch-green)';

  return (
    <div className="team-stats-tab" style={{ '--team-color': teamColor }}>
      {stats && (
        <>
          {/* Season Record — scoreboard-style digit tiles, same mono
              language as every score display in the app */}
          <motion.section
            className="stats-record-card"
            initial="hidden"
            animate="show"
            variants={listItem}
          >
            <h2 className="stats-section-title">Season Record</h2>
            <div className="stats-record-grid">
              <div className="stats-record-tile">
                <span className="stats-record-tile__value">{stats.matchesPlayed}</span>
                <span className="stats-record-tile__label">Played</span>
              </div>
              <div className="stats-record-tile">
                <span className="stats-record-tile__value stats-record-tile__value--win">{stats.wins}</span>
                <span className="stats-record-tile__label">Won</span>
              </div>
              <div className="stats-record-tile">
                <span className="stats-record-tile__value stats-record-tile__value--draw">{stats.draws}</span>
                <span className="stats-record-tile__label">Drawn</span>
              </div>
              <div className="stats-record-tile">
                <span className="stats-record-tile__value stats-record-tile__value--loss">{stats.losses}</span>
                <span className="stats-record-tile__label">Lost</span>
              </div>
              <div className="stats-record-tile">
                <span className="stats-record-tile__value">{stats.goalsFor}<span className="stats-record-tile__sep">:</span>{stats.goalsAgainst}</span>
                <span className="stats-record-tile__label">Goals F:A</span>
              </div>
              <div className="stats-record-tile">
                <span className="stats-record-tile__value">{stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}</span>
                <span className="stats-record-tile__label">Goal Diff</span>
              </div>
              <div className="stats-record-tile">
                <span className="stats-record-tile__value">{stats.cleanSheets}</span>
                <span className="stats-record-tile__label">Clean Sheets</span>
              </div>
            </div>
          </motion.section>

          {/* Team Performance — real metrics scaled to a realistic ceiling,
              filled in the team's own brand color like the header */}
          <motion.section
            className="stats-performance-card"
            initial="hidden"
            animate="show"
            variants={listItem}
            transition={{ ...listItem.show.transition, delay: 0.05 }}
          >
            <h2 className="stats-section-title">Team Performance</h2>
            <div className="stats-performance-list">
              {PERFORMANCE_METRICS.map((metric) => {
                const rawVal = stats[metric.key];
                const pct = Math.min(100, (parsePercent(rawVal) / metric.max) * 100);
                return (
                  <div className="stats-performance-row" key={metric.key}>
                    <div className="stats-performance-row__top">
                      <span className="stats-performance-row__label">{metric.label}</span>
                      <span className="stats-performance-row__value">{rawVal}</span>
                    </div>
                    <div className="stats-performance-row__track">
                      <span className="stats-performance-row__fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        </>
      )}

      {/* Squad Stats — full sortable leaderboard, distinct from the
          top-3-only preview already shown on Overview */}
      {outfieldSquad.length > 0 && (
        <motion.section
          className="stats-squad-card"
          initial="hidden"
          animate="show"
          variants={listItem}
          transition={{ ...listItem.show.transition, delay: 0.1 }}
        >
          <h2 className="stats-section-title">Squad Stats</h2>
          <div className="stats-table-scroll">
            <table className="stats-table">
              <colgroup>
                <col style={{ width: '40%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '14%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="stats-table__th">Player</th>
                  <th className="stats-table__th">Nation</th>
                  <th
                    className={`stats-table__th stats-table__th--sortable stats-table__th--center ${sortKey === 'rating' ? 'stats-table__th--active' : ''}`}
                    onClick={() => handleSort('rating')}
                  >
                    Rating
                  </th>
                  <th
                    className={`stats-table__th stats-table__th--sortable stats-table__th--center ${sortKey === 'goals' ? 'stats-table__th--active' : ''}`}
                    onClick={() => handleSort('goals')}
                  >
                    Goals
                  </th>
                  <th
                    className={`stats-table__th stats-table__th--sortable stats-table__th--center ${sortKey === 'assists' ? 'stats-table__th--active' : ''}`}
                    onClick={() => handleSort('assists')}
                  >
                    Assists
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedSquad.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    className={`stats-table__row ${positionGroupClass(p.position)}`}
                    initial="hidden"
                    animate="show"
                    variants={listItem}
                    transition={{ ...listItem.show.transition, delay: Math.min(i, 10) * 0.02 }}
                    onClick={() => navigate(`/players/${p.id}`)}
                  >
                    <td className="stats-table__td stats-table__td--player">
                      <span className="stats-table__player-name">{p.name}</span>
                      <span className="stats-table__player-pos">{p.position}</span>
                    </td>
                    <td className="stats-table__td">
                      <div className="stats-table__nation">
                        <Flag nationality={p.nationality} size={16} />
                        <span>{p.nationality}</span>
                      </div>
                    </td>
                    <td className="stats-table__td stats-table__td--center stats-table__td--rating">
                      {p.rating != null ? p.rating.toFixed(1) : '—'}
                    </td>
                    <td className="stats-table__td stats-table__td--center">{p.goals ?? 0}</td>
                    <td className="stats-table__td stats-table__td--center">{p.assists ?? 0}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      )}
    </div>
  );
}
