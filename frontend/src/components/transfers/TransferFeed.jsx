import { ChevronUp, ChevronDown, ArrowUpDown, Filter } from 'lucide-react';
import TransferCard from './TransferCard';
import './TransferFeed.css';

export default function TransferFeed({
  items,
  hasMore,
  onLoadMore,
  sortKey,
  sortDir,
  onSort,
  emptyMessage = 'No transfers match your filters',
  onReset,
}) {
  return (
    <div className="tf-feed">
      {items.length === 0 ? (
        <div className="tf-feed__empty">
          <Filter size={24} className="tf-feed__empty-icon" />
          <p className="tf-feed__empty-text">{emptyMessage}</p>
          {onReset && (
            <button className="tf-feed__empty-reset" onClick={onReset}>
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Column header row — copy exactly from Transfers.jsx */}
          <div className="transfer-feed__header">
            <span className="transfer-feed__col">FROM → TO</span>
            <span className="transfer-feed__col">PLAYER</span>
            <button
              type="button"
              className={`transfer-feed__sort-btn transfer-feed__sort-btn--right${
                sortKey === 'fee' ? ' transfer-feed__sort-btn--active' : ''
              }`}
              onClick={() => onSort('fee')}
            >
              <span>FEE</span>
              {sortKey === 'fee' ? (
                sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />
              ) : (
                <ArrowUpDown size={9} className="transfer-feed__sort-neutral" />
              )}
            </button>
            <span className="transfer-feed__col transfer-feed__col--center">TIER</span>
            <button
              type="button"
              className={`transfer-feed__sort-btn transfer-feed__sort-btn--right${
                sortKey === 'date' ? ' transfer-feed__sort-btn--active' : ''
              }`}
              onClick={() => onSort('date')}
            >
              <span>DATE</span>
              {sortKey === 'date' ? (
                sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />
              ) : (
                <ArrowUpDown size={9} className="transfer-feed__sort-neutral" />
              )}
            </button>
          </div>

          {/* Cards */}
          {items.map((item) => (
            <TransferCard key={item.id} item={item} />
          ))}

          {/* Footer */}
          <div className="tf-feed__footer">
            {hasMore ? (
              <button className="tf-feed__load-more" onClick={onLoadMore}>
                Load More
              </button>
            ) : (
              <p className="tf-feed__caught-up">You&rsquo;re all caught up</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
