// src/components/feed/LeagueGroup.jsx
// League section: collapsible header + match rows

// TASK C — Removed LEAGUE_ICONS, leagueToSlug, and LeagueDot entirely.
//           Now renders the shared <Crest> component using league.logoUrl from data.
// TASK A — Imports shared Crest component.

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Crest from '../shared/Crest';
import MatchRow from './MatchRow';
import './LeagueGroup.css';

// TASK C — league prop is now the FULL league object { name, logoUrl, slug, matchday, … }
// HomeFeed passes the object; the component reads logoUrl directly from it.
export default function LeagueGroup({ league, matches, matchday, favMatchIds, onToggleFav, dateLabel }) {
  // TASK A (smart default) — open if this league has matches, collapsed if empty
  const [isOpen, setIsOpen] = useState(() => matches.length > 0);

  const hasLiveMatch = matches.some((m) => m.status === 'live');

  // league can be a string (league name) OR an object with { name, logoUrl }.
  // Support both shapes so HomeFeed doesn't need to change in the same PR.
  const leagueName = typeof league === 'string' ? league : league.name;
  const leagueLogoUrl = typeof league === 'string' ? null : (league.logoUrl ?? null);

  return (
    <section className="league-group">

      {/* Clickable league header — toggles the match row list */}
      <button
        className="league-group__header"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls={`league-rows-${leagueName.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="league-group__header-left">
          {hasLiveMatch && (
            <span className="live-dot" aria-hidden="true" title="Live match in progress" />
          )}

          {/* TASK C — <Crest> replaces the old hand-crafted LeagueDot/badge system */}
          <Crest logoUrl={leagueLogoUrl} name={leagueName} size={34} />

          <span className="league-group__name">{leagueName}</span>
        </div>

        <div className="league-group__header-right">
          {matchday && (
            <span className="league-group__matchday">Matchday {matchday}</span>
          )}
          <ChevronDown
            className={`league-group__chevron${isOpen ? '' : ' is-collapsed'}`}
            size={14}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Collapsible match rows — grid-template-rows technique */}
      <div
        className={`league-group__collapsible${isOpen ? '' : ' is-collapsed'}`}
        id={`league-rows-${leagueName.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="league-group__collapsible-inner">
          {matches.length === 0 ? (
            <div className="league-group__empty">
              {/* dateLabel: 'today' | 'yesterday' | 'tomorrow' | 'on this date' */}
              <p className="league-group__empty-text">No matches {dateLabel}</p>
            </div>
          ) : (
            <div className="league-group__rows">
              {matches.map((match, i) => (
                <div key={match.id} className={i > 0 ? 'league-group__row-divider' : ''}>
                  <MatchRow
                    match={match}
                    isFavorited={favMatchIds.has(match.id)}
                    onToggleFav={onToggleFav}
                    animationDelay={i * 35}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
