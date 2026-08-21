// src/pages/Transfers.jsx
import { useState, useMemo, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import SearchModal from '../components/search/SearchModal';
import Breadcrumb from '../components/shared/Breadcrumb';
import TransferFilters from '../components/transfers/TransferFilters';
import TransferCard from '../components/transfers/TransferCard';
import TransferSidebar from '../components/transfers/TransferSidebar';
import { transfers } from '../data/mockData';
import './Transfers.css';

export default function Transfers() {
  const [activeTab, setActiveTab] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recency');
  const [leagueFilter, setLeagueFilter] = useState('all');
  const [timeframeFilter, setTimeframeFilter] = useState('all');
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

  const handlePositionChange = (pos) => {
    setPositionFilter(pos);
    setVisibleCount(8);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setVisibleCount(8);
  };

  const filtered = useMemo(() => {
    let result = [...transfers];

    // Tab filter
    if (activeTab === 'tier1') {
      result = result.filter((t) => t.tier === 1);
    } else if (activeTab === 'done') {
      result = result.filter((t) => t.status === 'confirmed');
    } else if (activeTab === 'rumors') {
      result = result.filter((t) => t.tier === 2 || t.tier === 3);
    }

    // Position filter
    if (positionFilter !== 'all') {
      result = result.filter((t) => t.position === positionFilter);
    }

    // Sidebar League filter
    if (leagueFilter !== 'all') {
      const targetLeague = leagueFilter === 'PL' ? 'Premier League' : leagueFilter;
      result = result.filter((t) => t.league === targetLeague);
    }

    // Sidebar Timeframe filter
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

    // Sort
    if (sortBy === 'fee') {
      const parseFee = (fee) => {
        if (!fee || fee === 'FREE' || fee === 'LOAN' || fee === 'UNDISCLOSED') return -1;
        const num = parseFloat(fee.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? -1 : num;
      };
      result.sort((a, b) => parseFee(b.fee) - parseFee(a.fee));
    } else if (sortBy === 'league') {
      result.sort((a, b) => a.league.localeCompare(b.league));
    }

    return result;
  }, [activeTab, positionFilter, sortBy, leagueFilter, timeframeFilter]);

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

          <TransferFilters
            activeTab={activeTab}
            onTabChange={handleTabChange}
            positionFilter={positionFilter}
            onPositionChange={handlePositionChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />

          {/* Transfer feed */}
          {filtered.length === 0 && (
            <div className="transfers__empty" role="status">
              No transfers match this filter
            </div>
          )}

          {visibleItems.length > 0 && (
            <div className="transfers__feed">
              {/* Column header */}
              <div className="transfer-feed__header">
                <span className="transfer-feed__col">FROM → TO</span>
                <span className="transfer-feed__col">PLAYER</span>
                <span className="transfer-feed__col transfer-feed__col--right">FEE</span>
                <span className="transfer-feed__col transfer-feed__col--center">TIER</span>
                <span className="transfer-feed__col transfer-feed__col--right">DATE</span>
              </div>

              {visibleItems.map((item) => (
                <TransferCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="transfers__footer">
              {hasMore ? (
                <button
                  className="transfers__load-more"
                  type="button"
                  onClick={() => setVisibleCount((v) => v + 8)}
                >
                  Load More Transfers
                </button>
              ) : (
                <p className="transfers__caught-up">You&rsquo;re all caught up</p>
              )}
            </div>
          )}
        </main>

        {/* Right panel sidebar */}
        <aside className="transfers__right" aria-label="Transfer filters and stats">
          <TransferSidebar
            leagueFilter={leagueFilter}
            onLeagueChange={(l) => {
              setLeagueFilter(l);
              setVisibleCount(8);
            }}
            timeframeFilter={timeframeFilter}
            onTimeframeChange={(tf) => {
              setTimeframeFilter(tf);
              setVisibleCount(8);
            }}
            topDeals={topDeals}
          />
        </aside>
      </AppLayout>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
