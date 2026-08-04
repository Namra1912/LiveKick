// src/components/feed/LeagueGroup.jsx
// League section: collapsible header + match rows

// TASK A — smart default open/closed
// TASK D — Bundesliga + Serie A slugs/icons
// TASK E — dateLabel prop for date-aware empty copy

import { useState } from 'react';
import { Crown, Shield, Trophy, Zap, Star, ChevronDown } from 'lucide-react'; // TASK D: added Zap, Star
import MatchRow from './MatchRow';
import './LeagueGroup.css';

// TASK D — added Bundesliga + Serie A
const LEAGUE_ICONS = {
  'Premier League':   Crown,
  'La Liga':          Shield,
  'Champions League': Trophy,
  'Bundesliga':       Zap,
  'Serie A':          Star,
};

// TASK D — added bundesliga + seriea slugs
function leagueToSlug(league) {
  if (league === 'Premier League')   return 'pl';
  if (league === 'La Liga')          return 'laliga';
  if (league === 'Champions League') return 'ucl';
  if (league === 'Bundesliga')       return 'bundesliga'; // TASK D
  if (league === 'Serie A')          return 'seriea';     // TASK D
  return 'default';
}

function LeagueDot({ league }) {
  const slug = leagueToSlug(league);
  const initials = league.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const IconComponent = LEAGUE_ICONS[league] ?? Trophy;

  return (
    <div className={`league-group__badge league-badge--${slug}`} aria-hidden="true">
      <IconComponent size={12} strokeWidth={2} className="league-group__badge-icon" />
      <span className="league-group__badge-text">{initials}</span>
    </div>
  );
}

// TASK E — accept dateLabel prop
export default function LeagueGroup({ league, matches, matchday, favMatchIds, onToggleFav, dateLabel }) {
  // TASK A — open if this league has matches, collapsed if empty
  // No localStorage — session-only so the smart default fires fresh on each date change
  // (key={`${league}-${selectedDate.value}`} in HomeFeed forces remount on date change)
  const [isOpen, setIsOpen] = useState(() => matches.length > 0);

  const hasLiveMatch = matches.some((m) => m.status === 'live');

  return (
    <section className="league-group">

      {/* Clickable league header — toggles the match row list */}
      <button
        className="league-group__header"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls={`league-rows-${league.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="league-group__header-left">
          {hasLiveMatch && (
            <span className="live-dot" aria-hidden="true" title="Live match in progress" />
          )}
          <LeagueDot league={league} />
          <span className="league-group__name">{league}</span>
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
        id={`league-rows-${league.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="league-group__collapsible-inner">
          {matches.length === 0 ? (
            <div className="league-group__empty">
              {/* TASK E — date-aware copy */}
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
