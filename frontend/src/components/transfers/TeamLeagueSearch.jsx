// src/components/transfers/TeamLeagueSearch.jsx
import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import Crest from '../shared/Crest';
import { teams, leagues } from '../../data/mockData';
import './TeamLeagueSearch.css';

function renderHighlightedName(name, query) {
  if (!query || !query.trim()) return name;
  const q = query.trim();
  const idx = name.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return name;
  const before = name.slice(0, idx);
  const match = name.slice(idx, idx + q.length);
  const after = name.slice(idx + q.length);
  return (
    <>
      {before}
      <strong className="tls-highlight">{match}</strong>
      {after}
    </>
  );
}

export default function TeamLeagueSearch({ selectedItems = [], onSelectionChange }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce filter query ~200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter available teams and leagues
  const suggestions = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const selectedIds = new Set(selectedItems.map((item) => item.id));

    // Form list of team items
    const teamItems = teams
      .map((t) => ({
        id: `team-${t.id}`,
        type: 'team',
        name: t.name,
        shortName: t.shortName,
        logoUrl: t.logoUrl,
        crestUrl: t.crestUrl,
        teamObj: t,
        caption: t.league || 'Club',
      }))
      .filter((t) => !selectedIds.has(t.id));

    // Form list of league items using real leagues dataset
    const leagueItems = leagues
      .map((l) => ({
        id: `league-${l.id}`,
        type: 'league',
        name: l.name,
        shortName: l.slug === 'pl' ? 'PL' : l.slug === 'bundesliga' ? 'BL' : l.slug === 'ligue1' ? 'L1' : l.name,
        logoUrl: l.logoUrl,
        crestUrl: l.logoUrl,
        teamObj: { logoUrl: l.logoUrl, name: l.name },
        caption: 'Competition',
      }))
      .filter((l) => !selectedIds.has(l.id));

    const combined = [...leagueItems, ...teamItems];

    if (!q) return combined.slice(0, 10);

    return combined
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.shortName && item.shortName.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [debouncedQuery, selectedItems]);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [suggestions]);

  const handleSelectItem = (item) => {
    onSelectionChange([...selectedItems, item]);
    setQuery('');
    setDebouncedQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleRemoveItem = (idToRemove) => {
    onSelectionChange(selectedItems.filter((item) => item.id !== idToRemove));
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(0, suggestions.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions[highlightedIndex]) {
        handleSelectItem(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className="tls-container" ref={containerRef}>
      <div className="tls-input-wrapper">
        <Search size={13} className="tls-search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="tls-input"
          placeholder="Search team or league..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            type="button"
            className="tls-clear-query"
            onClick={() => {
              setQuery('');
              setDebouncedQuery('');
            }}
            aria-label="Clear text"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Selected Chips */}
      {selectedItems.length > 0 && (
        <div className="tls-chips">
          {selectedItems.map((item) => (
            <span key={item.id} className="tls-chip">
              <Crest
                team={item.teamObj}
                logoUrl={item.logoUrl}
                crestUrl={item.crestUrl}
                name={item.name}
                size={14}
              />
              <span className="tls-chip-name">{item.shortName || item.name}</span>
              <button
                type="button"
                className="tls-chip-remove"
                onClick={() => handleRemoveItem(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="tls-dropdown" role="listbox">
          {suggestions.length === 0 ? (
            <div className="tls-no-results">No team or league found</div>
          ) : (
            suggestions.map((item, index) => {
              const isHighlighted = index === highlightedIndex;
              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isHighlighted}
                  tabIndex={0}
                  className={`tls-option${isHighlighted ? ' tls-option--highlighted' : ''}`}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSelectItem(item);
                  }}
                >
                  <Crest
                    team={item.teamObj}
                    logoUrl={item.logoUrl}
                    crestUrl={item.crestUrl}
                    name={item.name}
                    size={20}
                  />
                  <div className="tls-option-info">
                    <span className="tls-option-name">
                      {renderHighlightedName(item.name, query)}
                    </span>
                    <span className="tls-option-caption">{item.caption}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
