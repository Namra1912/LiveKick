// src/components/team-profile/TransfersTab.jsx
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import FeeRangeSlider from '../transfers/FeeRangeSlider';
import TransferCard from '../transfers/TransferCard';
import './TransfersTab.css';

export default function TransfersTab({ team, transfers: allTransfers }) {
  // Filter transfers to only those involving this team
  const teamTransfers = useMemo(() => {
    if (!allTransfers || !team) return [];
    return allTransfers.filter(
      (t) => t.fromTeam?.id === team.id || t.toTeam?.id === team.id
    );
  }, [allTransfers, team]);

  // State
  const [statusFilter, setStatusFilter] = useState('confirmed');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [feeRange, setFeeRange] = useState({ min: 0, max: 150 });
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [visibleCount, setVisibleCount] = useState(8);

  const parseFee = (fee) => {
    if (!fee || ['FREE', 'LOAN', 'UNDISCLOSED'].includes(fee)) return -1;
    const num = parseFloat(fee.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? -1 : num;
  };

  const filtered = useMemo(() => {
    let result = [...teamTransfers];

    // Status filter
    result = result.filter((t) => t.status === statusFilter);

    // Direction filter
    if (directionFilter === 'in') {
      result = result.filter((t) => t.toTeam?.id === team.id);
    } else if (directionFilter === 'out') {
      result = result.filter((t) => t.fromTeam?.id === team.id);
    }

    // Fee range filter
    if (feeRange.min > 0 || feeRange.max < 150) {
      result = result.filter((t) => {
        if (!t.fee || ['FREE', 'LOAN', 'UNDISCLOSED'].includes(t.fee)) {
          return true;
        }
        const num = parseFloat(t.fee.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return true;
        if (feeRange.max >= 150) return num >= feeRange.min;
        return num >= feeRange.min && num <= feeRange.max;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortKey === 'fee') {
        const fA = parseFee(a.fee), fB = parseFee(b.fee);
        if (fA === -1 && fB === -1) return 0;
        if (fA === -1) return 1;
        if (fB === -1) return -1;
        return sortDir === 'desc' ? fB - fA : fA - fB;
      }
      const dA = a.transferDate || '', dB = b.transferDate || '';
      return sortDir === 'desc' ? dB.localeCompare(dA) : dA.localeCompare(dB);
    });

    return result;
  }, [teamTransfers, statusFilter, directionFilter, feeRange, sortKey, sortDir, team.id]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setVisibleCount(8);
  };

  // Window stats (computed from ALL teamTransfers)
  const windowStats = useMemo(() => {
    const confirmed = teamTransfers.filter((t) => t.status === 'confirmed');
    const inCount = confirmed.filter((t) => t.toTeam?.id === team.id).length;
    const outCount = confirmed.filter((t) => t.fromTeam?.id === team.id).length;
    const spent = confirmed
      .filter((t) => t.toTeam?.id === team.id)
      .reduce((s, t) => s + Math.max(parseFee(t.fee), 0), 0);
    const received = confirmed
      .filter((t) => t.fromTeam?.id === team.id)
      .reduce((s, t) => s + Math.max(parseFee(t.fee), 0), 0);
    const net = received - spent;
    return { inCount, outCount, net };
  }, [teamTransfers, team.id]);

  const formattedNet =
    windowStats.net === 0
      ? '€0M'
      : windowStats.net > 0
      ? `+€${windowStats.net.toFixed(0)}M`
      : `-€${Math.abs(windowStats.net).toFixed(0)}M`;

  const getDirection = (item) => {
    if (item.toTeam?.id === team.id) return 'in';
    if (item.fromTeam?.id === team.id) return 'out';
    return null;
  };

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="ttab">
      {/* ── LEFT PANEL ── */}
      <aside className="ttab__panel">
        <h3 className="ttab__panel-heading">Edit</h3>

        {/* In / Out / All */}
        <div className="ttab__panel-section">
          <span className="ttab__panel-label">In or out</span>
          <div className="ttab__toggle-row">
            {['all', 'in', 'out'].map((dir) => (
              <button
                key={dir}
                className={`ttab__toggle-btn ${
                  directionFilter === dir ? 'ttab__toggle-btn--active' : ''
                }`}
                onClick={() => {
                  setDirectionFilter(dir);
                  setVisibleCount(8);
                }}
              >
                {dir === 'all' ? 'All' : dir === 'in' ? 'In' : 'Out'}
              </button>
            ))}
          </div>
        </div>

        {/* Fee Range */}
        <div className="ttab__panel-section">
          <FeeRangeSlider
            minVal={feeRange.min}
            maxVal={feeRange.max}
            onChange={(r) => {
              setFeeRange(r);
              setVisibleCount(8);
            }}
          />
        </div>

        {/* This Window */}
        <div className="ttab__panel-section ttab__panel-section--stats">
          <span className="ttab__panel-label">This Window</span>
          <div className="ttab__stat-row">
            <span className="ttab__stat-label">↙ Incoming</span>
            <span className="ttab__stat-val ttab__stat-val--green">
              {windowStats.inCount}
            </span>
          </div>
          <div className="ttab__stat-row">
            <span className="ttab__stat-label">↗ Outgoing</span>
            <span className="ttab__stat-val ttab__stat-val--red">
              {windowStats.outCount}
            </span>
          </div>
          <div className="ttab__stat-row">
            <span className="ttab__stat-label">Net spend</span>
            <span
              className={`ttab__stat-val ${
                windowStats.net > 0
                  ? 'ttab__stat-val--green'
                  : windowStats.net < 0
                  ? 'ttab__stat-val--red'
                  : ''
              }`}
            >
              {formattedNet}
            </span>
          </div>
        </div>
      </aside>

      {/* ── RIGHT FEED ── */}
      <div className="ttab__main">
        {/* Confirmed / Rumors toggle */}
        <div className="ttab__status-bar">
          <div className="ttab__status-toggle">
            {[
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'rumor', label: 'Rumors' },
            ].map((s) => (
              <button
                key={s.key}
                className={`ttab__status-btn ${
                  statusFilter === s.key ? 'ttab__status-btn--active' : ''
                }`}
                onClick={() => {
                  setStatusFilter(s.key);
                  setVisibleCount(8);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column headers — copy from TransferFeed */}
        <div className="transfer-feed__header">
          <span className="transfer-feed__col">FROM → TO</span>
          <span className="transfer-feed__col">PLAYER</span>
          <button
            type="button"
            className={`transfer-feed__sort-btn transfer-feed__sort-btn--right ${
              sortKey === 'fee' ? 'transfer-feed__sort-btn--active' : ''
            }`}
            onClick={() => handleSort('fee')}
          >
            <span>FEE</span>
            {sortKey === 'fee' ? (
              sortDir === 'desc' ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronUp size={11} />
              )
            ) : (
              <ArrowUpDown size={9} className="transfer-feed__sort-neutral" />
            )}
          </button>
          <span className="transfer-feed__col transfer-feed__col--center">
            TIER
          </span>
          <button
            type="button"
            className={`transfer-feed__sort-btn transfer-feed__sort-btn--right ${
              sortKey === 'date' ? 'transfer-feed__sort-btn--active' : ''
            }`}
            onClick={() => handleSort('date')}
          >
            <span>DATE</span>
            {sortKey === 'date' ? (
              sortDir === 'desc' ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronUp size={11} />
              )
            ) : (
              <ArrowUpDown size={9} className="transfer-feed__sort-neutral" />
            )}
          </button>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="tf-feed__empty">
            <p className="tf-feed__empty-text">
              No {statusFilter === 'confirmed' ? 'confirmed transfers' : 'rumors'}{' '}
              found
              {directionFilter !== 'all'
                ? ` (${directionFilter === 'in' ? 'incoming' : 'outgoing'} only)`
                : ''}
            </p>
          </div>
        )}

        {/* Rows with direction accent */}
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className={`ttab-row-wrap ttab-row-wrap--${getDirection(item)}`}
          >
            <TransferCard item={item} />
          </div>
        ))}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="tf-feed__footer">
            {hasMore ? (
              <button
                className="tf-feed__load-more"
                onClick={() => setVisibleCount((v) => v + 8)}
              >
                Load More
              </button>
            ) : (
              <p className="tf-feed__caught-up">All transfers loaded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
