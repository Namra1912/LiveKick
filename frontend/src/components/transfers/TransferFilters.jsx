// src/components/transfers/TransferFilters.jsx
import './TransferFilters.css';

const TABS = [
  { key: 'all', label: 'ALL TRANSFERS' },
  { key: 'tier1', label: 'TIER 1' },
  { key: 'done', label: 'DONE DEALS' },
  { key: 'rumors', label: 'RUMORS' },
];

export default function TransferFilters({ activeTab, onTabChange }) {
  return (
    <div className="tf-container">
      <div className="tf-tabs" role="tablist" aria-label="Transfer status tabs">
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
    </div>
  );
}
