// src/components/layout/Sidebar.jsx
// Left sidebar: nav links, MY TEAMS section, Match Day Live pill

import { useState } from 'react';
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
} from 'lucide-react';
import { matches } from '../../data/mockData';
import './Sidebar.css';

function teamHasLiveMatch(teamId) {
  return matches.some(
    (m) =>
      m.status === 'live' &&
      (m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
  );
}

const NAV_ITEMS = [
  { label: 'Matches',            path: '/',             icon: LayoutGrid },
  { label: 'News',               path: '/news',          icon: Newspaper },
  { label: 'Standings',          path: '/standings',     icon: BarChart2 },
  { label: 'Transfers',          path: '/transfers',     icon: ArrowLeftRight },
  { label: 'Predictions League', path: '/predictions',   icon: Trophy },
  { label: 'Tactics Lab',        path: '/tactics',       icon: FlaskConical },
];

// Tinted dark team colors — saturated enough to read at a glance without
// hovering. Placeholder until real crest assets are sourced (see
// DESIGN.md → Team Badges); TeamBadge should prefer team.crestUrl when
// that field exists.
export const MUTED_TEAM_COLORS = {
  1:  { bg: '#3a1418', border: '#5c1f26', text: '#f4a5ac' }, // Arsenal
  2:  { bg: '#0f2740', border: '#1a3c60', text: '#8fc4f0' }, // Man City
  3:  { bg: '#3a1416', border: '#5c1f22', text: '#f4a1a1' }, // Liverpool
  4:  { bg: '#0f1f42', border: '#1a2f63', text: '#94aef0' }, // Chelsea
  5:  { bg: '#1a2530', border: '#2c3d4d', text: '#e2e8f0' }, // Tottenham
  6:  { bg: '#3a1418', border: '#5c1f26', text: '#f4a5ac' }, // Man Utd
  7:  { bg: '#1a2530', border: '#2c3d4d', text: '#e2e8f0' }, // Real Madrid
  8:  { bg: '#3a1418', border: '#5c1f26', text: '#f4a5ac' }, // Atletico
  9:  { bg: '#3a1230', border: '#5c1e4a', text: '#f0a1d4' }, // Barcelona
  10: { bg: '#0f3320', border: '#1a4f32', text: '#8ff0b8' }, // Betis
  11: { bg: '#3d2e0f', border: '#5f471a', text: '#f0d18f' }, // Dortmund
  12: { bg: '#0f2a40', border: '#1a4160', text: '#8fc9f0' }, // Inter
};

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

export default function Sidebar({
  favoriteTeams,
  allTeams,
  isLiveOnly = false,
  onToggleLiveOnly,
  hasAnyLiveMatches = false,
}) {
  const navigate = useNavigate();

  const myTeams = favoriteTeams
    .map((id) => allTeams.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <aside className="sidebar">
      {/* Scrollable area */}
      <div className="sidebar__scroll">
        <nav className="sidebar__nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* MY TEAMS */}
        <div className="sidebar__section">
          <p className="sidebar__section-label">My Teams</p>
          <div className="sidebar__team-list">
            {myTeams.map((team) => (
              <TeamRow
                key={team.id}
                team={team}
                onClick={(id) => navigate(`/teams/${id}`)}
              />
            ))}
          </div>

          {/* Add Team */}
          <button className="sidebar__add-team-btn">
            <div className="sidebar__add-team-icon">
              <Plus size={11} strokeWidth={2} color="var(--color-faint)" />
            </div>
            <span className="sidebar__add-team-label">Add Team</span>
          </button>
        </div>
      </div>

      {/* Bottom: Settings + Match Day Live */}
      <div className="sidebar__bottom">
        {/* Settings */}
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

        {/* Match Day Live pill */}
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
