// src/components/transfers/TransferSidebar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TeamLeagueSearch from './TeamLeagueSearch';
import FeeRangeSlider from './FeeRangeSlider';
import TimeframeSelect from './TimeframeSelect';
import './TransferSidebar.css';

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

const TRANSFER_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'permanent', label: 'Permanent' },
  { value: 'loan', label: 'Loan' },
  { value: 'free', label: 'Free' },
];

export default function TransferSidebar({
  selectedTeamLeagues = [],
  onTeamLeaguesChange,
  feeRange = { min: 0, max: 150 },
  onFeeRangeChange,
  timeframeFilter = 'all',
  onTimeframeChange,
  positionFilter = 'all',
  onPositionChange,
  transferTypeFilter = 'all',
  onTransferTypeChange,
  onResetFilters,
  topDeals = [],
}) {
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const hasSecondaryActive = positionFilter !== 'all' || transferTypeFilter !== 'all';

  const activeFilterCount =
    (selectedTeamLeagues.length > 0 ? 1 : 0) +
    (feeRange.min > 0 || feeRange.max < 150 ? 1 : 0) +
    (timeframeFilter !== 'all' ? 1 : 0) +
    (positionFilter !== 'all' ? 1 : 0) +
    (transferTypeFilter !== 'all' ? 1 : 0);

  const isFiltered = activeFilterCount > 0;

  return (
    <div className="ts-filter-panel">
      {/* Panel Header */}
      <div className="ts-panel-header">
        <div className="ts-panel-header__left">
          <span className="ts-panel-title">FILTERS</span>
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

      {/* 3.1 Essential Filters */}
      <div className="ts-section">
        {/* Team / League Search */}
        <div className="ts-field">
          <span className="ts-field-label">League or Team</span>
          <TeamLeagueSearch
            selectedItems={selectedTeamLeagues}
            onSelectionChange={onTeamLeaguesChange}
          />
        </div>

        {/* Fee Range Slider */}
        <div className="ts-field">
          <FeeRangeSlider
            minVal={feeRange.min}
            maxVal={feeRange.max}
            onChange={onFeeRangeChange}
          />
        </div>

        {/* Timeframe Select */}
        <div className="ts-field">
          <span className="ts-field-label">Timeframe</span>
          <TimeframeSelect
            value={timeframeFilter}
            onChange={onTimeframeChange}
          />
        </div>
      </div>

      {/* 3.2 Secondary Filters Disclosure */}
      <div className="ts-section ts-section--secondary">
        <button
          type="button"
          className="ts-more-toggle"
          onClick={() => setMoreOpen(!moreOpen)}
          aria-expanded={moreOpen}
        >
          <span>{moreOpen ? 'Fewer filters' : 'More filters'}</span>
          {!moreOpen && hasSecondaryActive && <span className="ts-more-dot" />}
          {moreOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {moreOpen && (
          <div className="ts-more-content">
            <div className="ts-field">
              <span className="ts-field-label">Position</span>
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

            <div className="ts-field">
              <span className="ts-field-label">Transfer Type</span>
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
        )}
      </div>

      {/* 3.3 Top Deals Widget (Integrated Section) */}
      <div className="ts-section ts-section--top-deals">
        <span className="ts-eyebrow-label">TOP DEALS</span>
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
