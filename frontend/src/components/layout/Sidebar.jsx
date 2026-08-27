// src/components/layout/Sidebar.jsx
// Left sidebar: fixed nav links, scrollable My Teams + My Leagues (accordion), fixed bottom

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
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
  X,
  Search,
} from 'lucide-react';
import { matches, leagues } from '../../data/mockData';
import Crest from '../shared/Crest';
import { useLenisScroll } from '../../hooks/useLenisScroll';
import { useFollowedTeams } from '../../context/FollowedTeamsContext';
import './Sidebar.css';

// ── helpers & persistence ─────────────────────────────────────────────────────

const LS_FAV_TEAMS = 'lk_fav_teams';
const LS_FAV_LEAGUES = 'lk_fav_leagues';

function teamHasLiveMatch(teamId) {
  return matches.some(
    (m) =>
      m.status === 'live' &&
      (m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
  );
}

function readJson(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val === null ? fallback : JSON.parse(val);
  } catch {
    return fallback;
  }
}

// ── constants ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Matches', path: '/', icon: LayoutGrid },
  { label: 'News', path: '/news', icon: Newspaper },
  { label: 'Standings', path: '/standings', icon: BarChart2 },
  { label: 'Transfers', path: '/transfers', icon: ArrowLeftRight },
  { label: 'Predictions League', path: '/predictions', icon: Trophy },
  { label: 'Tactics Lab', path: '/tactics', icon: FlaskConical },
];

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

function TeamRow({ team, onClick, onRemove }) {
  const isLive = teamHasLiveMatch(team.id);
  return (
    <div className="sidebar__item-wrapper">
      <button
        type="button"
        className="sidebar__team-btn"
        onClick={() => onClick(team.id)}
      >
        <Crest logoUrl={team.logoUrl ?? team.crestUrl} name={team.name} size={35} />
        <span className="sidebar__team-name">{team.name}</span>
        {isLive && (
          <span className="live-dot" title="Live match in progress" />
        )}
      </button>
      {onRemove && (
        <button
          type="button"
          className="sidebar__remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(team.id);
          }}
          aria-label={`Remove ${team.name} from favorites`}
          title={`Remove ${team.name}`}
        >
          <X size={12} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

function LeagueRow({ league, isActive, onRemove }) {
  return (
    <div className="sidebar__item-wrapper">
      <Link
        to={`/standings?league=${league.slug}`}
        className={`sidebar__league-row${isActive ? ' sidebar__league-row--active' : ''}`}
        style={{ textDecoration: 'none' }}
      >
        <Crest logoUrl={league.logoUrl} name={league.name} size={35} />
        <span className={`sidebar__league-name${isActive ? ' sidebar__league-name--active' : ''}`}>
          {league.name}
        </span>
      </Link>
      {onRemove && (
        <button
          type="button"
          className="sidebar__remove-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(league.id);
          }}
          aria-label={`Remove ${league.name} from favorites`}
          title={`Remove ${league.name}`}
        >
          <X size={12} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

// ── Floating Portal Popover Picker ─────────────────────────────────────────────

function PickerPopover({
  title,
  placeholder,
  items,
  renderItem,
  onClose,
  triggerRef,
  position,
}) {
  const [query, setQuery] = useState('');
  const popoverRef = useRef(null);

  // Capture-phase keydown listener: blocks global ⌘K search & handles Escape key
  useEffect(() => {
    const handleCaptureKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        e.stopPropagation();
        onClose(); // Close-popover-first (requires 2nd ⌘K press once closed to open SearchModal)
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    // Use capture phase (true) to intercept ⌘K before page-level keydown listeners
    window.addEventListener('keydown', handleCaptureKeyDown, true);
    return () => window.removeEventListener('keydown', handleCaptureKeyDown, true);
  }, [onClose]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(q);
      const subMatch = item.league ? item.league.toLowerCase().includes(q) : false;
      const shortMatch = item.shortName ? item.shortName.toLowerCase().includes(q) : false;
      return nameMatch || subMatch || shortMatch;
    });
  }, [items, query]);

  if (!position) return null;

  return createPortal(
    <>
      {/* Scrim/backdrop — lighter opacity (rgba(8,12,17,0.45)) than SearchModal, intercepts clicks */}
      <div
        className="sidebar-popover__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Popover Panel */}
      <div
        ref={popoverRef}
        className="sidebar-popover"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        role="dialog"
        aria-label={title}
      >
        {/* Title bar — styled matching StandingsTable column headers */}
        <div className="sidebar-popover__title-bar">
          <span className="sidebar-popover__title">{title}</span>
          <button
            type="button"
            className="sidebar-popover__close-btn"
            onClick={onClose}
            aria-label="Close picker"
          >
            <X size={14} />
          </button>
        </div>

        {/* Search Bar Input (aligned with TopNav / SearchModal search bar chrome) */}
        <div className="sidebar-popover__search-wrap">
          <Search size={14} strokeWidth={2} color="var(--color-dimmer)" />
          <input
            type="text"
            className="sidebar-popover__input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="sidebar-popover__list">
          {filteredItems.length === 0 ? (
            <div className="sidebar-popover__empty">No items found</div>
          ) : (
            filteredItems.map((item) => renderItem(item))
          )}
        </div>
      </div>
    </>,
    document.body
  );
}


// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar({
  favoriteTeams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  allTeams = [],
  isLiveOnly = false,
  onToggleLiveOnly,
  hasAnyLiveMatches = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomeFeed = location.pathname === '/';
  const isStandingsPage = location.pathname === '/standings';
  const activeLeagueSlug = isStandingsPage
    ? (new URLSearchParams(location.search).get('league') || 'pl')
    : null;

  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  useLenisScroll(scrollRef, contentRef);

  // Trigger button references for portal popover positioning & outside click exclusion
  const addTeamBtnRef = useRef(null);
  const addLeagueBtnRef = useRef(null);

  // Shared Followed Teams state from context
  const { favTeamIds, followTeam: handleAddTeam, unfollowTeam: handleRemoveTeam } = useFollowedTeams();

  // Accordion state
  const [teamsOpen, setTeamsOpen] = useState(() => readJson('lk_sb_teams', true));
  const [leaguesOpen, setLeaguesOpen] = useState(() => readJson('lk_sb_leagues', true));

  // Portal Popover state
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamPickerPos, setTeamPickerPos] = useState(null);

  const [showAddLeague, setShowAddLeague] = useState(false);
  const [leaguePickerPos, setLeaguePickerPos] = useState(null);

  // Favorited League IDs (localStorage-backed)
  const defaultLeagueIds = leagues.map((l) => l.id);
  const [favLeagueIds, setFavLeagueIds] = useState(() => readJson(LS_FAV_LEAGUES, defaultLeagueIds));

  // Sync to localStorage
  useEffect(() => {
    try { localStorage.setItem('lk_sb_teams', JSON.stringify(teamsOpen)); } catch { }
  }, [teamsOpen]);

  useEffect(() => {
    try { localStorage.setItem('lk_sb_leagues', JSON.stringify(leaguesOpen)); } catch { }
  }, [leaguesOpen]);

  useEffect(() => {
    try { localStorage.setItem(LS_FAV_LEAGUES, JSON.stringify(favLeagueIds)); } catch { }
  }, [favLeagueIds]);

  // Handlers for adding/removing league favorites
  const handleRemoveLeague = useCallback((leagueId) => {
    setFavLeagueIds((prev) => prev.filter((id) => id !== leagueId));
  }, []);

  const handleAddLeague = useCallback((leagueId) => {
    setFavLeagueIds((prev) => (prev.includes(leagueId) ? prev : [...prev, leagueId]));
  }, []);

  // Open Popovers with position calculated from trigger button
  const handleOpenTeamPicker = (e) => {
    if (showAddTeam) {
      setShowAddTeam(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setTeamPickerPos({
      top: Math.min(Math.max(16, rect.top - 20), window.innerHeight - 340),
      left: Math.min(rect.right + 12, window.innerWidth - 340),
    });
    setShowAddTeam(true);
    setShowAddLeague(false);
  };

  const handleOpenLeaguePicker = (e) => {
    if (showAddLeague) {
      setShowAddLeague(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setLeaguePickerPos({
      top: Math.min(Math.max(16, rect.top - 20), window.innerHeight - 300),
      left: Math.min(rect.right + 12, window.innerWidth - 340),
    });
    setShowAddLeague(true);
    setShowAddTeam(false);
  };

  // Derived favorited objects & available picker lists
  const myTeams = useMemo(
    () => favTeamIds.map((id) => allTeams.find((t) => t.id === id)).filter(Boolean),
    [favTeamIds, allTeams]
  );

  const myLeagues = useMemo(
    () => favLeagueIds.map((id) => leagues.find((l) => l.id === id)).filter(Boolean),
    [favLeagueIds]
  );

  const availableTeams = useMemo(
    () => allTeams.filter((t) => !favTeamIds.includes(t.id)),
    [allTeams, favTeamIds]
  );

  const availableLeagues = useMemo(
    () => leagues.filter((l) => !favLeagueIds.includes(l.id)),
    [favLeagueIds]
  );

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
      <div className="sidebar__scroll" ref={scrollRef}>
        <div className="sidebar__scroll-content" ref={contentRef}>

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
                  {myTeams.length === 0 ? (
                    <div className="sidebar__empty-msg">No favorite teams yet</div>
                  ) : (
                    myTeams.map((team) => (
                      <TeamRow
                        key={team.id}
                        team={team}
                        onClick={(id) => navigate(`/teams/${id}`)}
                        onRemove={handleRemoveTeam}
                      />
                    ))
                  )}
                </div>

                {/* Add Team trigger button */}
                <button
                  ref={addTeamBtnRef}
                  className="sidebar__add-team-btn"
                  onClick={handleOpenTeamPicker}
                >
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
                  {myLeagues.length === 0 ? (
                    <div className="sidebar__empty-msg">No favorite leagues yet</div>
                  ) : (
                    myLeagues.map((league) => (
                      <LeagueRow
                        key={league.id}
                        league={league}
                        isActive={isStandingsPage && activeLeagueSlug === league.slug}
                        onRemove={handleRemoveLeague}
                      />
                    ))
                  )}
                </div>

                {/* Add League trigger button */}
                <button
                  ref={addLeagueBtnRef}
                  className="sidebar__add-team-btn"
                  onClick={handleOpenLeaguePicker}
                >
                  <div className="sidebar__add-team-icon">
                    <Plus size={11} strokeWidth={2} color="var(--color-faint)" />
                  </div>
                  <span className="sidebar__add-team-label">Add League</span>
                </button>
              </div>
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

        {isHomeFeed && (
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
        )}
      </div>

      {/* ── Floating Portal Popovers ──────────────────────────────────── */}
      {showAddTeam && (
        <PickerPopover
          title="ADD TEAM"
          placeholder="Search team to add..."
          items={availableTeams}
          onClose={() => setShowAddTeam(false)}
          triggerRef={addTeamBtnRef}
          position={teamPickerPos}
          renderItem={(t) => (
            <button
              key={t.id}
              type="button"
              className="sidebar-popover__item"
              onClick={() => handleAddTeam(t.id)}
            >
              <Crest logoUrl={t.logoUrl ?? t.crestUrl} name={t.name} size={24} />
              <div className="sidebar-popover__item-info">
                <span className="sidebar-popover__item-name">{t.name}</span>
                <span className="sidebar-popover__item-sub">{t.league}</span>
              </div>
              <div className="sidebar-popover__add-btn">
                <Plus size={13} strokeWidth={2.5} />
              </div>
            </button>
          )}
        />
      )}

      {showAddLeague && (
        <PickerPopover
          title="ADD LEAGUE"
          placeholder="Search league to add..."
          items={availableLeagues}
          onClose={() => setShowAddLeague(false)}
          triggerRef={addLeagueBtnRef}
          position={leaguePickerPos}
          renderItem={(l) => (
            <button
              key={l.id}
              type="button"
              className="sidebar-popover__item"
              onClick={() => handleAddLeague(l.id)}
            >
              <Crest logoUrl={l.logoUrl} name={l.name} size={24} />
              <div className="sidebar-popover__item-info">
                <span className="sidebar-popover__item-name">{l.name}</span>
                <span className="sidebar-popover__item-sub">{l.country}</span>
              </div>
              <div className="sidebar-popover__add-btn">
                <Plus size={13} strokeWidth={2.5} />
              </div>
            </button>
          )}
        />
      )}


    </aside>
  );
}
