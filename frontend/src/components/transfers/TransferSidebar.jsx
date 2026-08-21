// src/components/transfers/TransferSidebar.jsx
import './TransferSidebar.css';

const LEAGUES = [
  { value: 'all', label: 'All' },
  { value: 'PL', label: 'PL' },
  { value: 'La Liga', label: 'La Liga' },
  { value: 'Serie A', label: 'Serie A' },
  { value: 'Bundesliga', label: 'BL' },
  { value: 'Ligue 1', label: 'L1' },
];

const TIMEFRAMES = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

export default function TransferSidebar({
  leagueFilter,
  onLeagueChange,
  timeframeFilter,
  onTimeframeChange,
  topDeals = [],
}) {
  return (
    <div className="transfer-sidebar">
      {/* Section 1: Filters */}
      <div className="ts-card">
        <span className="ts-section-label">Filters</span>

        <div className="ts-filter-group">
          <span className="ts-filter-group__label">League</span>
          <div className="ts-pills" role="toolbar" aria-label="League sidebar filter">
            {LEAGUES.map((l) => (
              <button
                key={l.value}
                type="button"
                className={`ts-pill${leagueFilter === l.value ? ' ts-pill--active' : ''}`}
                onClick={() => onLeagueChange(l.value)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ts-filter-group">
          <span className="ts-filter-group__label">Timeframe</span>
          <div className="ts-pills" role="toolbar" aria-label="Timeframe sidebar filter">
            {TIMEFRAMES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`ts-pill${timeframeFilter === t.value ? ' ts-pill--active' : ''}`}
                onClick={() => onTimeframeChange(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Top Deals */}
      <div className="ts-card">
        <span className="ts-section-label">Top Deals</span>
        <div className="ts-top-deals">
          {topDeals.map((deal, i) => (
            <div key={deal.id} className="ts-deal-row">
              <span className={`ts-deal-rank${i === 0 ? ' ts-deal-rank--1' : ''}`}>
                {i + 1}
              </span>
              <div className="ts-deal-info">
                <span className="ts-deal-name">{deal.player}</span>
                <span className="ts-deal-clubs">
                  {deal.fromTeam?.shortName ?? '?'} → {deal.toTeam?.shortName ?? '?'}
                </span>
              </div>
              <span className="ts-deal-fee">{deal.fee}</span>
            </div>
          ))}
          {topDeals.length === 0 && (
            <span className="ts-empty">No confirmed deals yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
