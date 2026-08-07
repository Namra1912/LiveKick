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
import Crest from '../shared/Crest'; // TASK A: Crest component replaces old league dot
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

// TASK A: Deleted dead LEAGUE_DOT_COLORS & leagueNameToSlug logic.

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
      <Crest logoUrl={team.logoUrl ?? team.crestUrl} name={team.name} size={30} />
      <span className="sidebar__team-name">{team.name}</span>
      {isLive && (
        <span className="live-dot" title="Live match in progress" />
      )}
    </button>
  );
}

// TASK A: Render Crest component (size 18) with logoUrl & name directly from mockData leagues object
function LeagueRow({ league }) {
  return (
    <div className="sidebar__league-row">
      <Crest logoUrl={league.logoUrl} name={league.name} size={18} />
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
