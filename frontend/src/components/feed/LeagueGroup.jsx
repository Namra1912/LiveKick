// src/components/feed/LeagueGroup.jsx
// League section: header (gold dot + badge + name) + match rows

import { Crown, Shield, Trophy } from 'lucide-react';
import MatchRow from './MatchRow';
import './LeagueGroup.css';

const DEFAULT_FAVORITED_IDS = new Set([104]);

const LEAGUE_ICONS = {
  'Premier League': Crown,
  'La Liga': Shield,
  'Champions League': Trophy,
};

function leagueToSlug(league) {
  if (league === 'Premier League') return 'pl';
  if (league === 'La Liga') return 'laliga';
  if (league === 'Champions League') return 'ucl';
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

export default function LeagueGroup({ league, matches, matchday }) {
  const hasLiveMatch = matches.some((m) => m.status === 'live');

  return (
    <section className="league-group">
      {/* League header */}
      <div className="league-group__header">
        <div className="league-group__header-left">
          {hasLiveMatch && (
            <span className="live-dot" aria-hidden="true" title="Live match in progress" />
          )}
          <LeagueDot league={league} />
          <span className="league-group__name">{league}</span>
        </div>
        {matchday && (
          <span className="league-group__matchday">Matchday {matchday}</span>
        )}
      </div>

      {/* Match rows */}
      {matches.length === 0 ? (
        <div className="league-group__empty">
          <p className="league-group__empty-text">No matches today</p>
        </div>
      ) : (
        <div className="league-group__rows">
          {matches.map((match, i) => (
            <div key={match.id} className={i > 0 ? 'league-group__row-divider' : ''}>
              <MatchRow
                match={match}
                defaultFavorited={DEFAULT_FAVORITED_IDS.has(match.id)}
                animationDelay={i * 35}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
