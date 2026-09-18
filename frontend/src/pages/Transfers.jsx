// src/pages/Transfers.jsx
import { useState, useMemo, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import SearchModal from '../components/search/SearchModal';
import Breadcrumb from '../components/shared/Breadcrumb';
import TransferFilters from '../components/transfers/TransferFilters';
import TransferFeed from '../components/transfers/TransferFeed';
import TransferSidebar from '../components/transfers/TransferSidebar';
import { transfers } from '../data/mockData';
import './Transfers.css';

export default function Transfers() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTeamLeagues, setSelectedTeamLeagues] = useState([]);
  const [feeRange, setFeeRange] = useState({ min: 0, max: 150 });
  const [timeframeFilter, setTimeframeFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [transferTypeFilter, setTransferTypeFilter] = useState('all');
  
  // Table Header Sort State
  const [sortKey, setSortKey] = useState('date'); // 'date' | 'fee'
  const [sortDir, setSortDir] = useState('desc'); // 'desc' | 'asc'

  const [visibleCount, setVisibleCount] = useState(8);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(8);
  };

  // Clamp Fee Range slider handles into valid range when activeTab changes
  useEffect(() => {
    const tabItems = transfers.filter((t) => {
      if (activeTab === 'tier1') return t.tier === 1;
      if (activeTab === 'done') return t.status === 'confirmed';
      if (activeTab === 'rumors') return t.tier === 2 || t.tier === 3;
      return true;
    });

    const numericFees = tabItems
      .map((t) => {
        if (!t.fee || t.fee === 'FREE' || t.fee === 'LOAN' || t.fee === 'UNDISCLOSED') return null;
        const num = parseFloat(t.fee.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
      })
      .filter((n) => n !== null);

    if (numericFees.length > 0) {
      const maxFeeInTab = Math.ceil(Math.max(...numericFees));
      setFeeRange((prev) => {
        let newMin = prev.min;
        let newMax = prev.max;
        if (newMin > maxFeeInTab) newMin = 0;
        if (newMin === prev.min && newMax === prev.max) return prev;
        return { min: newMin, max: newMax };
      });
    }
  }, [activeTab]);

  const handleHeaderSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setVisibleCount(8);
  };

  const handleResetFilters = () => {
    setSelectedTeamLeagues([]);
    setFeeRange({ min: 0, max: 150 });
    setTimeframeFilter('all');
    setPositionFilter('all');
    setTransferTypeFilter('all');
    setSortKey('date');
    setSortDir('desc');
    setVisibleCount(8);
  };

  const filtered = useMemo(() => {
    let result = [...transfers];

    // 1. Tab filter
    if (activeTab === 'tier1') {
      result = result.filter((t) => t.tier === 1);
    } else if (activeTab === 'done') {
      result = result.filter((t) => t.status === 'confirmed');
    } else if (activeTab === 'rumors') {
      result = result.filter((t) => t.tier === 2 || t.tier === 3);
    }

    // 2. Team & League Multi-filter (OR logic among chips)
    if (selectedTeamLeagues.length > 0) {
      result = result.filter((t) => {
        return selectedTeamLeagues.some((chip) => {
          if (chip.type === 'league') {
            const targetLeague = chip.shortName === 'PL' ? 'Premier League' : chip.name;
            return t.league === targetLeague;
          }
          if (chip.type === 'team' && chip.teamObj) {
            const teamId = chip.teamObj.id;
            return t.fromTeam?.id === teamId || t.toTeam?.id === teamId;
          }
          return false;
        });
      });
    }

    // 3. Fee Range Filter
    if (feeRange.min > 0 || feeRange.max < 150) {
      result = result.filter((t) => {
        if (!t.fee || t.fee === 'FREE' || t.fee === 'LOAN' || t.fee === 'UNDISCLOSED') {
          return true; // Keep special fee types visible
        }
        const num = parseFloat(t.fee.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return true;
        if (feeRange.max >= 150) return num >= feeRange.min;
        return num >= feeRange.min && num <= feeRange.max;
      });
    }

    // 4. Timeframe filter
    if (timeframeFilter === 'week') {
      result = result.filter((t) => {
        const ts = t.timestamp ?? '';
        return ts.includes('h ago') || ts === '1d ago';
      });
    } else if (timeframeFilter === 'month') {
      result = result.filter((t) => {
        const ts = t.timestamp ?? '';
        const days = parseInt(ts, 10);
        if (ts.includes('h ago')) return true;
        if (ts.includes('d ago') && days <= 30) return true;
        return false;
      });
    }

    // 5. Position filter
    if (positionFilter !== 'all') {
      result = result.filter((t) => t.position === positionFilter);
    }

    // 6. Transfer Type filter
    if (transferTypeFilter !== 'all') {
      result = result.filter((t) => t.transferType === transferTypeFilter);
    }

    // 7. Column Header Sort
    const parseFee = (fee) => {
      if (!fee || fee === 'FREE' || fee === 'LOAN' || fee === 'UNDISCLOSED') return -1;
      const num = parseFloat(fee.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? -1 : num;
    };

    result.sort((a, b) => {
      if (sortKey === 'fee') {
        const feeA = parseFee(a.fee);
        const feeB = parseFee(b.fee);
        if (feeA === -1 && feeB === -1) return 0;
        if (feeA === -1) return 1;
        if (feeB === -1) return -1;
        return sortDir === 'desc' ? feeB - feeA : feeA - feeB;
      }

      // Default: sortKey === 'date' (using transferDate ISO string)
      const dateA = a.transferDate || '';
      const dateB = b.transferDate || '';
      return sortDir === 'desc' ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
    });

    return result;
  }, [
    activeTab,
    selectedTeamLeagues,
    feeRange,
    timeframeFilter,
    positionFilter,
    transferTypeFilter,
    sortKey,
    sortDir,
  ]);

  const topDeals = useMemo(() => {
    const parseFee = (fee) => {
      if (!fee || fee === 'FREE' || fee === 'LOAN' || fee === 'UNDISCLOSED') return -1;
      const num = parseFloat(fee.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? -1 : num;
    };
    return [...transfers]
      .filter((t) => t.status === 'confirmed')
      .sort((a, b) => parseFee(b.fee) - parseFee(a.fee))
      .slice(0, 3);
  }, []);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <AppLayout onSearchOpen={() => setIsSearchOpen(true)}>
        <main className="transfers__center">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Transfers' }]} />

          <div className="transfers__header">
            <h1 className="transfers__title">Transfer Radar</h1>
            <p className="transfers__subtitle">TRANSFER &amp; RUMOR INDEX</p>
          </div>

          <TransferFilters activeTab={activeTab} onTabChange={handleTabChange} />

          <TransferFeed
            items={visibleItems}
            hasMore={hasMore}
            onLoadMore={() => setVisibleCount((v) => v + 8)}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleHeaderSort}
            onReset={handleResetFilters}
          />
        </main>

        {/* Right panel sidebar */}
        <aside className="transfers__right" aria-label="Transfer filters and stats">
          <TransferSidebar
            selectedTeamLeagues={selectedTeamLeagues}
            onTeamLeaguesChange={(items) => {
              setSelectedTeamLeagues(items);
              setVisibleCount(8);
            }}
            feeRange={feeRange}
            onFeeRangeChange={(range) => {
              setFeeRange(range);
              setVisibleCount(8);
            }}
            timeframeFilter={timeframeFilter}
            onTimeframeChange={(tf) => {
              setTimeframeFilter(tf);
              setVisibleCount(8);
            }}
            positionFilter={positionFilter}
            onPositionChange={(pos) => {
              setPositionFilter(pos);
              setVisibleCount(8);
            }}
            transferTypeFilter={transferTypeFilter}
            onTransferTypeChange={(tt) => {
              setTransferTypeFilter(tt);
              setVisibleCount(8);
            }}
            onResetFilters={handleResetFilters}
            topDeals={topDeals}
          />
        </aside>
      </AppLayout>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
