// src/components/layout/Sidebar.jsx
// Left sidebar: fixed nav links, scrollable My Teams + My Leagues (accordion), fixed bottom

import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Newspaper,
  BarChart2,
  ArrowLeftRight,
  Trophy,
  FlaskConical,
  Plus,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { matches, leagues } from '../../data/mockData';
import './Sidebar.css';

// ── helpers ──────────────────────────────────────────────────────────────────

function teamHasLiveMatch(teamId) {
  return matches.some(
    (m) =>
      m.status === 'live' &&
      (m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
  );
}

function readBool(key, fallback = true) {
  try {
    const val = localStorage.getItem(key);
    return val === null ? fallback : JSON.parse(val);
  } catch {
    return fallback;
  }
}

// ── constants ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Matches',            path: '/',           icon: LayoutGrid },
  { label: 'News',               path: '/news',        icon: Newspaper },
  { label: 'Standings',          path: '/standings',   icon: BarChart2 },
  { label: 'Transfers',          path: '/transfers',   icon: ArrowLeftRight },
  { label: 'Predictions League', path: '/predictions', icon: Trophy },
  { label: 'Tactics Lab',        path: '/tactics',     icon: FlaskConical },
];

const LEAGUE_DOT_COLORS = {
  pl:         '#3d195b',
  laliga:     '#ff4b44',
  ucl:        '#1b3fa0',
  bundesliga: '#d20515',
  seriea:     '#008fd7',
};

function leagueNameToSlug(name) {
  const n = name.toLowerCase().replace(/\s+/g, '');
  if (n.includes('premier'))  return 'pl';
  if (n.includes('liga'))     return 'laliga';
  if (n.includes('champion')) return 'ucl';
  if (n.includes('bundes'))   return 'bundesliga';
  if (n.includes('serie'))    return 'seriea';
  return 'pl';
}

// ── sub-components ────────────────────────────────────────────────────────────

export function TeamBadge({ team, size = 'md' }) {
  const [imgError, setImgError] = useState(false);
  const initials = (team?.shortName ?? team?.name ?? '').slice(0, 2).toUpperCase();
  const sizeClass = size === 'lg' ? 'sidebar__team-badge--lg' : 'sidebar__team-badge--md';
  const teamClass = team?.id ? `team-badge--team-${team.id}` : 'team-badge--default';

  if (team?.crestUrl && !imgError) {
    return (
      <img
        src={team.crestUrl}
        alt={team?.name ?? 'Team'}
        className={`team-badge--crest ${sizeClass}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`team-badge ${teamClass} ${sizeClass}`}>
      {initials}
    </div>
  );
}

function NavItem({ item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className="sidebar__nav-link"
    >
      {({ isActive }) => (
        <div className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}>
          <Icon
            size={16}
            strokeWidth={isActive ? 2 : 1.5}
            className={`sidebar__nav-icon ${isActive ? 'sidebar__nav-icon--active' : ''}`}
          />
          <span>{item.label}</span>
        </div>
      )}
    </NavLink>
  );
}

function TeamRow({ team, onClick }) {
  const isLive = teamHasLiveMatch(team.id);
  return (
    <button
      className="sidebar__team-btn"
      onClick={() => onClick(team.id)}
    >
      <TeamBadge team={team} />
      <span className="sidebar__team-name">{team.name}</span>
      {isLive && (
        <span className="live-dot" title="Live match in progress" />
      )}
    </button>
  );
}

function LeagueRow({ league }) {
  const slug = leagueNameToSlug(league.name);
  const dotColor = LEAGUE_DOT_COLORS[slug] ?? '#475569';
  return (
    <div className="sidebar__league-row">
      <span
        className="sidebar__league-dot"
        style={{ backgroundColor: dotColor }}
        aria-hidden="true"
      />
      <span className="sidebar__league-name">{league.name}</span>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar({
  favoriteTeams,
  allTeams,
  isLiveOnly = false,
  onToggleLiveOnly,
  hasAnyLiveMatches = false,
}) {
  const navigate = useNavigate();

  // Accordion state — initialised from localStorage, written on every change
  const [teamsOpen,   setTeamsOpen]   = useState(() => readBool('lk_sb_teams',   true));
  const [leaguesOpen, setLeaguesOpen] = useState(() => readBool('lk_sb_leagues', true));

  useEffect(() => {
    try { localStorage.setItem('lk_sb_teams', JSON.stringify(teamsOpen)); } catch {}
  }, [teamsOpen]);

  useEffect(() => {
    try { localStorage.setItem('lk_sb_leagues', JSON.stringify(leaguesOpen)); } catch {}
  }, [leaguesOpen]);

  const myTeams = favoriteTeams
    .map((id) => allTeams.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <aside className="sidebar">

      {/* ── Region 2: Fixed main nav ─────────────────────────────────── */}
      <div className="sidebar__nav-section">
        <nav className="sidebar__nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
      </div>

      {/* ── Region 3: Scrollable — My Teams + My Leagues ─────────────── */}
      <div className="sidebar__scroll">

        {/* MY TEAMS accordion */}
        <div className="sidebar__section">
          <button
            className="sidebar__section-toggle"
            onClick={() => setTeamsOpen((o) => !o)}
            aria-expanded={teamsOpen}
            aria-controls="sidebar-teams-list"
          >
            <span className="sidebar__section-label">My Teams</span>
            <ChevronDown className="sidebar__chevron" size={12} strokeWidth={2} />
          </button>

          <div
            className={`sidebar__collapsible${teamsOpen ? '' : ' is-collapsed'}`}
            id="sidebar-teams-list"
          >
            <div className="sidebar__collapsible-inner">
              <div className="sidebar__team-list">
                {myTeams.map((team) => (
                  <TeamRow
                    key={team.id}
                    team={team}
                    onClick={(id) => navigate(`/teams/${id}`)}
                  />
                ))}
              </div>
              <button className="sidebar__add-team-btn">
                <div className="sidebar__add-team-icon">
                  <Plus size={11} strokeWidth={2} color="var(--color-faint)" />
                </div>
                <span className="sidebar__add-team-label">Add Team</span>
              </button>
            </div>
          </div>
        </div>

        {/* MY LEAGUES accordion */}
        <div className="sidebar__section">
          <button
            className="sidebar__section-toggle"
            onClick={() => setLeaguesOpen((o) => !o)}
            aria-expanded={leaguesOpen}
            aria-controls="sidebar-leagues-list"
          >
            <span className="sidebar__section-label">My Leagues</span>
            <ChevronDown className="sidebar__chevron" size={12} strokeWidth={2} />
          </button>

          <div
            className={`sidebar__collapsible${leaguesOpen ? '' : ' is-collapsed'}`}
            id="sidebar-leagues-list"
          >
            <div className="sidebar__collapsible-inner">
              <div className="sidebar__league-list">
                {leagues.map((league) => (
                  <LeagueRow key={league.id} league={league} />
                ))}
              </div>
              <button className="sidebar__add-team-btn">
                <div className="sidebar__add-team-icon">
                  <Plus size={11} strokeWidth={2} color="var(--color-faint)" />
                </div>
                <span className="sidebar__add-team-label">Add League</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Region 4: Fixed bottom — Settings + Match Day Live ───────── */}
      <div className="sidebar__bottom">
        <NavLink to="/settings" className="sidebar__nav-link">
          {({ isActive }) => (
            <div className={`sidebar__settings-item ${isActive ? 'sidebar__settings-item--active' : ''}`}>
              <Settings
                size={16}
                strokeWidth={1.5}
                color={isActive ? 'var(--color-pitch-green)' : 'var(--color-faint)'}
              />
              <span>Settings</span>
            </div>
          )}
        </NavLink>

        <button
          id="match-day-live-btn"
          className={`sidebar__live-btn${isLiveOnly ? ' sidebar__live-btn--active' : ''}`}
          onClick={onToggleLiveOnly}
          aria-pressed={isLiveOnly}
          title={isLiveOnly ? 'Exit live filter' : 'Filter feed to live matches'}
        >
          <span className={`sidebar__live-dot${hasAnyLiveMatches ? '' : ' sidebar__live-dot--static'}`} />
          <span>{isLiveOnly ? 'Exit Live View ×' : 'Match Day Live'}</span>
        </button>
      </div>

    </aside>
  );
}
