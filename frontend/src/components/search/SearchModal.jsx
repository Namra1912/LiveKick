// src/components/search/SearchModal.jsx
/**
 * ROUTE MAPPING CONFIRMATION:
 * - Team results navigate to `/teams/${team.id}` using AppRouter's existing `/teams/:id` route.
 * - League results navigate to `/standings?league=${league.slug}` using the active league slug contract.
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { X, Search, ChevronRight } from 'lucide-react';
import Crest from '../shared/Crest';
import { teams, leagues } from '../../data/mockData';
import './SearchModal.css';

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Reset query and selected index when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filter leagues and teams based on query
  const { filteredLeagues, filteredTeams, combinedResults } = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return { filteredLeagues: [], filteredTeams: [], combinedResults: [] };
    }

    const matchedLeagues = leagues.filter(
      (l) =>
        l.name.toLowerCase().includes(trimmed) ||
        (l.country && l.country.toLowerCase().includes(trimmed))
    );

    const matchedTeams = teams.filter(
      (t) =>
        t.name.toLowerCase().includes(trimmed) ||
        (t.shortName && t.shortName.toLowerCase().includes(trimmed))
    );

    const combined = [
      ...matchedLeagues.map((l) => ({ type: 'league', data: l })),
      ...matchedTeams.map((t) => ({ type: 'team', data: t })),
    ];

    return {
      filteredLeagues: matchedLeagues,
      filteredTeams: matchedTeams,
      combinedResults: combined,
    };
  }, [query]);

  // Reset selection index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item) => {
    if (!item) return;
    if (item.type === 'team') {
      navigate(`/teams/${item.data.id}`);
    } else if (item.type === 'league') {
      navigate(`/standings?league=${item.data.slug}`);
    }
    onClose();
  };

  // Keyboard navigation & Escape handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (combinedResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < combinedResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : combinedResults.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < combinedResults.length) {
          handleSelect(combinedResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, combinedResults, selectedIndex, onClose]);

  if (!isOpen) return null;

  const isSearching = query.trim().length > 0;
  const hasResults = combinedResults.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="search-modal__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className="search-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="search-modal__box">
          {/* Search input row */}
          <div className="search-modal__input-row">
            <Search size={18} strokeWidth={1.75} color="var(--color-faint)" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams, leagues..."
              className="search-modal__input"
              aria-label="Search input"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="search-modal__clear-btn"
                aria-label="Clear search input"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="search-modal__close-btn"
              aria-label="Close search"
            >
              <X size={14} strokeWidth={2} color="var(--color-secondary)" />
            </button>
          </div>

          {/* Body content based on state */}
          {!isSearching && (
            <div className="search-modal__empty">
              <p className="search-modal__empty-primary">
                Start typing to search teams and leagues
              </p>
              <p className="search-modal__empty-secondary">
                Player search is coming later
              </p>
            </div>
          )}

          {isSearching && !hasResults && (
            <div className="search-modal__empty">
              <p className="search-modal__empty-primary">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="search-modal__empty-secondary">
                Player search is coming later
              </p>
            </div>
          )}

          {isSearching && hasResults && (
            <div className="search-modal__results-container">
              {/* Leagues Section */}
              {filteredLeagues.length > 0 && (
                <div className="search-modal__section">
                  <div className="search-modal__section-header">Leagues</div>
                  {filteredLeagues.map((league) => {
                    const globalIdx = combinedResults.findIndex(
                      (res) => res.type === 'league' && res.data.id === league.id
                    );
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <div
                        key={`league-${league.id}`}
                        className={`search-modal__item ${
                          isSelected ? 'search-modal__item--selected' : ''
                        }`}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        onClick={() => handleSelect({ type: 'league', data: league })}
                      >
                        <Crest logoUrl={league.logoUrl} name={league.name} size={24} />
                        <div className="search-modal__item-info">
                          <span className="search-modal__item-name">{league.name}</span>
                          <span className="search-modal__item-sub">
                            {league.country} &middot; Matchday {league.matchday}
                          </span>
                        </div>
                        <span className="search-modal__item-badge">League</span>
                        <ChevronRight size={14} className="search-modal__item-arrow" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Teams Section */}
              {filteredTeams.length > 0 && (
                <div className="search-modal__section">
                  <div className="search-modal__section-header">Teams</div>
                  {filteredTeams.map((team) => {
                    const globalIdx = combinedResults.findIndex(
                      (res) => res.type === 'team' && res.data.id === team.id
                    );
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <div
                        key={`team-${team.id}`}
                        className={`search-modal__item ${
                          isSelected ? 'search-modal__item--selected' : ''
                        }`}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        onClick={() => handleSelect({ type: 'team', data: team })}
                      >
                        <Crest team={team} size={24} />
                        <div className="search-modal__item-info">
                          <span className="search-modal__item-name">{team.name}</span>
                          <span className="search-modal__item-sub">
                            {team.league} &middot; {team.country}
                          </span>
                        </div>
                        <span className="search-modal__item-badge">{team.shortName}</span>
                        <ChevronRight size={14} className="search-modal__item-arrow" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
