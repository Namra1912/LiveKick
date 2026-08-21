// src/components/transfers/TransferSidebar.jsx
import { useNavigate } from 'react-router-dom';
import './TransferSidebar.css';

const SORT_OPTIONS = [
  { value: 'recency', label: 'Latest First' },
  { value: 'fee', label: 'Fee (High → Low)' },
  { value: 'tier', label: 'Tier (High → Low)' },
  { value: 'league', label: 'League A–Z' },
];

const POSITIONS = [
  { value: 'all', label: 'All' },
  { value: 'ST', label: 'ST' },
  { value: 'AM', label: 'AM' },
  { value: 'CM', label: 'CM' },
  { value: 'CDM', label: 'CDM' },
  { value: 'LW', label: 'LW' },
  { value: 'RW', label: 'RW' },
  { value: 'LB', label: 'LB' },
  { value: 'RB', label: 'RB' },
  { value: 'CB', label: 'CB' },
  { value: 'GK', label: 'GK' },
];

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

const TRANSFER_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'permanent', label: 'Permanent' },
  { value: 'loan', label: 'Loan' },
  { value: 'free', label: 'Free' },
];

export default function TransferSidebar({
  sortBy,
  onSortChange,
  positionFilter,
  onPositionChange,
  leagueFilter,
  onLeagueChange,
  timeframeFilter,
  onTimeframeChange,
  transferTypeFilter,
  onTransferTypeChange,
  onResetFilters,
  topDeals = [],
}) {
  const navigate = useNavigate();

  const activeFilterCount =
    (positionFilter !== 'all' ? 1 : 0) +
    (leagueFilter !== 'all' ? 1 : 0) +
    (timeframeFilter !== 'all' ? 1 : 0) +
    (transferTypeFilter !== 'all' ? 1 : 0);

  const isFiltered = activeFilterCount > 0 || sortBy !== 'recency';

  return (
    <div className="transfer-sidebar">
      {/* Card 1: Sort & Position */}
      <div className="ts-card">
        <span className="ts-section-label">Sort &amp; Position</span>

        <div className="ts-filter-group">
          <span className="ts-filter-group__label">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="ts-select"
            aria-label="Sort transfers"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ts-filter-group">
          <span className="ts-filter-group__label">Position</span>
          <div className="ts-pills ts-pills--wrapped" role="toolbar" aria-label="Position filter">
            {POSITIONS.map((pos) => (
              <button
                key={pos.value}
                type="button"
                className={`ts-pill${positionFilter === pos.value ? ' ts-pill--active' : ''}`}
                onClick={() => onPositionChange(pos.value)}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card 2: Filters */}
      <div className="ts-card">
        <div className="ts-card-header">
          <div className="ts-card-header__left">
            <span className="ts-section-label">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ts-filter-count">{activeFilterCount} active</span>
            )}
          </div>
          {isFiltered && (
            <button type="button" className="ts-reset-btn" onClick={onResetFilters}>
              Reset
            </button>
          )}
        </div>

        <div className="ts-filter-group">
          <span className="ts-filter-group__label">League</span>
          <div className="ts-pills" role="toolbar" aria-label="League filter">
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
          <div className="ts-pills" role="toolbar" aria-label="Timeframe filter">
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

        <div className="ts-filter-group">
          <span className="ts-filter-group__label">Transfer Type</span>
          <div className="ts-pills" role="toolbar" aria-label="Transfer type filter">
            {TRANSFER_TYPES.map((tt) => (
              <button
                key={tt.value}
                type="button"
                className={`ts-pill${transferTypeFilter === tt.value ? ' ts-pill--active' : ''}`}
                onClick={() => onTransferTypeChange(tt.value)}
              >
                {tt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: Top Deals */}
      <div className="ts-card">
        <span className="ts-section-label">Top Deals</span>
        <div className="ts-top-deals">
          {topDeals.map((deal, i) => (
            <div
              key={deal.id}
              className="ts-deal-row"
              role="button"
              tabIndex={0}
              onClick={() => navigate('/players/' + deal.id)}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/players/' + deal.id)}
            >
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
