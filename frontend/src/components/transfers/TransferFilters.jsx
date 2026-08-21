// src/components/transfers/TransferFilters.jsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './TransferFilters.css';

const TABS = [
  { key: 'all', label: 'ALL TRANSFERS' },
  { key: 'tier1', label: 'TIER 1' },
  { key: 'done', label: 'DONE DEALS' },
  { key: 'rumors', label: 'RUMORS' },
];

const POSITIONS = [
  { value: 'all', label: 'ALL' },
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

const SORT_OPTIONS = [
  { value: 'recency', label: 'Latest First' },
  { value: 'fee', label: 'Fee (High → Low)' },
  { value: 'league', label: 'League A–Z' },
];

export default function TransferFilters({
  activeTab,
  onTabChange,
  positionFilter,
  onPositionChange,
  sortBy,
  onSortChange,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ?? 'Sort';

  return (
    <div className="tf-container">
      {/* Tab Row */}
      <div className="tf-tabs" role="tablist" aria-label="Transfer tabs">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`tf-tab ${isActive ? 'tf-tab--active' : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Row: Position Pills (Left) + Sort Dropdown (Right) */}
      <div className="tf-filter-row">
        <div className="tf-filter-row__left">
          <div className="tf-position-pills" role="toolbar" aria-label="Position filters">
            {POSITIONS.map((pos) => {
              const isActive = positionFilter === pos.value;
              return (
                <button
                  key={pos.value}
                  type="button"
                  className={`tf-pill ${isActive ? 'tf-pill--active' : ''}`}
                  onClick={() => onPositionChange(pos.value)}
                >
                  {pos.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="tf-filter-row__right" ref={sortRef}>
          <div className="tf-sort-wrapper">
            <button
              type="button"
              className="tf-sort-trigger"
              onClick={() => setSortOpen((open) => !open)}
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
            >
              <span>{currentSortLabel}</span>
              <ChevronDown
                size={12}
                className={`tf-sort-chevron ${sortOpen ? 'tf-sort-chevron--open' : ''}`}
              />
            </button>

            {sortOpen && (
              <div className="tf-sort-panel" role="listbox">
                {SORT_OPTIONS.map((opt) => {
                  const isActive = sortBy === opt.value;
                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isActive}
                      tabIndex={0}
                      className={`tf-sort-option ${isActive ? 'tf-sort-option--active' : ''}`}
                      onClick={() => {
                        onSortChange(opt.value);
                        setSortOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onSortChange(opt.value);
                          setSortOpen(false);
                        }
                      }}
                    >
                      {opt.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
