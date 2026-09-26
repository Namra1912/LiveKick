// src/pages/TeamDetail.jsx — Team Profile Page
import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import Breadcrumb from '../components/shared/Breadcrumb';
import Crest from '../components/shared/Crest';
import SearchModal from '../components/search/SearchModal';
import StubPage from '../components/shared/StubPage';
import StandingsTable from '../components/standings/StandingsTable';
import TeamForm from '../components/team-profile/TeamForm';
import TopPerformers from '../components/team-profile/TopPerformers';
import StartingXI from '../components/team-profile/StartingXI';
import FixtureDifficultyCard from '../components/team-profile/FixtureDifficultyCard';
import StadiumInfoCard from '../components/team-profile/StadiumInfoCard';
import AboutSection from '../components/team-profile/AboutSection';
import TeamNews from '../components/team-profile/TeamNews';
import TeamNewsTab from '../components/team-profile/TeamNewsTab';
import FixturesTab from '../components/team-profile/FixturesTab';
import SquadTab from '../components/team-profile/SquadTab';
import TransfersTab from '../components/team-profile/TransfersTab';
import TeamStatsTab from '../components/team-profile/TeamStatsTab';
import { useFollowedTeams } from '../context/FollowedTeamsContext';
import { useLenisScroll } from '../hooks/useLenisScroll';
import { teams, leagues, news, matches, squads, transfers, standings } from '../data/mockData';
import { listItem, panelFade } from '../lib/motion';
import '../styles/StubPage.css';
import './TeamDetail.css';

function ordinal(n) {
  if (n == null) return '—';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const TABS = [
  { id: 'OVERVIEW',   label: 'OVERVIEW'  },
  { id: 'FIXTURES',   label: 'FIXTURES'  },
  { id: 'SQUAD',      label: 'SQUAD'     },
  { id: 'TRANSFERS',  label: 'TRANSFERS' },
  { id: 'STATS',      label: 'STATS'     },
  { id: 'NEWS',       label: 'NEWS'      },
];

export default function TeamDetail() {
  const { id, tab } = useParams();
  const navigate = useNavigate();

  const VALID_TABS = TABS.map(t => t.id);
  const activeTab = VALID_TABS.includes(tab?.toUpperCase())
    ? tab.toUpperCase()
    : 'OVERVIEW';

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isFollowing, toggleFollow } = useFollowedTeams();

  // Scroll container refs & Lenis smooth scroll hook
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  useLenisScroll(scrollRef, contentRef);

  // Find team by ID parameter, defaulting to Barcelona (id: 9)
  const team = useMemo(() => {
    const numericId = Number(id);
    return teams.find((t) => t.id === numericId) ?? teams.find((t) => t.id === 9) ?? teams[0];
  }, [id]);

  const following = isFollowing(team.id);

  // Derive league object for StandingsTable
  const activeLeague = useMemo(() => {
    return leagues.find((l) => l.name === team.league) ?? leagues[1];
  }, [team]);

  // This team's row in its own league table — powers the header stat strip
  const leagueStanding = useMemo(() => {
    return standings[team.league]?.find((r) => r.team.id === team.id) ?? null;
  }, [team]);

  const teamColor = team.primaryColor || 'var(--color-pitch-green)';

  // Filter news articles for this team (overview card)
  const teamArticles = useMemo(() => {
    return news.filter(
      (a) =>
        a.teamId === team.id ||
        a.team?.toLowerCase() === team.name?.toLowerCase() ||
        a.team === 'barcelona' ||
        a.team === team.shortName?.toLowerCase()
    );
  }, [team]);

  // All news articles for full News Tab
  const allArticles = useMemo(() => {
    return news
      .filter((a) => a.teamId === team.id || a.team === 'barcelona')
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [team]);

  // Global ⌘K shortcut listener
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

  // Shared per-section entrance — spread onto a motion.div for the staggered
  // Overview-grid reveal (replaces the old CSS --reveal-delay custom property).
  const reveal = (ms) => ({
    initial: 'hidden',
    animate: 'show',
    variants: listItem,
    transition: { ...listItem.show.transition, delay: ms / 1000 },
  });

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Teams', path: '/' },
    { label: team.name },
  ];

  return (
    <>
      <AppLayout onSearchOpen={() => setIsSearchOpen(true)}>
        <main className="team-profile" ref={scrollRef}>
          <div className="team-profile__inner" ref={contentRef}>
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Header Card — tinted with the team's own brand color, not a
                generic dark rectangle every team shares */}
            <header className="team-header__card" style={{ '--team-color': teamColor }}>
              <div className="team-header__main">
                <div className="team-header__crest-ring">
                  <Crest
                    logoUrl={team.logoUrl ?? team.crestUrl}
                    name={team.name}
                    size={64}
                  />
                </div>
                <div className="team-header__info">
                  <h1 className="team-header__name">{team.name}</h1>
                  <p className="team-header__subtitle">{team.league}</p>
                  {leagueStanding && (
                    <div className="team-header__stat-strip">
                      <div className="team-header__stat">
                        <span className="team-header__stat-value">{ordinal(leagueStanding.position)}</span>
                        <span className="team-header__stat-label">Position</span>
                      </div>
                      <div className="team-header__stat-divider" />
                      <div className="team-header__stat">
                        <span className="team-header__stat-value">{leagueStanding.points}</span>
                        <span className="team-header__stat-label">Points</span>
                      </div>
                      <div className="team-header__stat-divider" />
                      <div className="team-header__stat">
                        <span className="team-header__stat-value">
                          {leagueStanding.won}-{leagueStanding.drawn}-{leagueStanding.lost}
                        </span>
                        <span className="team-header__stat-label">W-D-L</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className={`team-header__follow-btn ${following ? 'team-header__follow-btn--following' : ''}`}
                onClick={() => toggleFollow(team.id)}
                aria-pressed={following}
              >
                {following ? 'Following' : '+ Follow'}
              </button>
            </header>

            {/* Navigation Tab Bar — position:relative for the sliding indicator */}
            <nav
              className="team-profile__tab-bar"
              aria-label="Team section tabs"
            >
              {TABS.map((tabItem) => {
                const isActive = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    type="button"
                    data-tab={tabItem.id}
                    className={`team-profile__tab-btn ${isActive ? 'team-profile__tab-btn--active' : ''}`}
                    onClick={() => navigate(`/teams/${id}/${tabItem.id.toLowerCase()}`)}
                  >
                    {tabItem.label}
                    {/* Shared-element sliding underline — one motion element that
                        glides between tabs instead of a manually-measured div. */}
                    {isActive && (
                      <motion.div
                        className="tab-indicator"
                        layoutId="team-tab-indicator"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Tab Content Section — cross-fades on switch via Framer Motion */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="tab-content-panel"
                initial="hidden"
                animate="show"
                exit="exit"
                variants={panelFade}
              >
              {activeTab === 'OVERVIEW' && (
                <section className="team-profile__overview-grid">
                  {/* ── Center Column (Top to Bottom) ────────────────────── */}
                  <div className="team-profile__center-col">
                    {/* 1. Team Form */}
                    <motion.div {...reveal(0)}>
                      <TeamForm team={team} />
                    </motion.div>

                    {/* 2. League Table */}
                    <motion.div
                      className="team-profile__table-embed"
                      data-highlight-team={team.id}
                      {...reveal(60)}
                    >
                      <StandingsTable league={activeLeague} highlightTeamId={team.id} />
                    </motion.div>

                    {/* 3. Top Performers */}
                    <motion.div {...reveal(120)}>
                      <TopPerformers team={team} />
                    </motion.div>

                    {/* 4. Team News Card */}
                    <motion.div {...reveal(180)}>
                      <TeamNews
                        articles={teamArticles}
                        onSeeMore={() => navigate(`/teams/${id}/news`)}
                      />
                    </motion.div>

                    {/* 5. About Section */}
                    <motion.div {...reveal(240)}>
                      <AboutSection team={team} />
                    </motion.div>
                  </div>

                  {/* ── Right Column (Sticky, Top to Bottom) ────────────── */}
                  <aside className="team-profile__right-col">
                    {/* 1. Starting XI Pitch Graphic */}
                    <motion.div {...reveal(0)}>
                      <StartingXI team={team} />
                    </motion.div>

                    {/* 2 & 3. Fixture Difficulty + Upcoming Fixtures */}
                    <motion.div {...reveal(60)}>
                      <FixtureDifficultyCard team={team} />
                    </motion.div>

                    {/* 4. Stadium Info Card */}
                    <motion.div {...reveal(120)}>
                      <StadiumInfoCard team={team} />
                    </motion.div>
                  </aside>
                </section>
              )}

              {activeTab === 'NEWS' && (
                <TeamNewsTab articles={allArticles} />
              )}

              {activeTab === 'FIXTURES' && (
                <FixturesTab team={team} matches={matches} leagues={leagues} />
              )}

              {activeTab === 'SQUAD' && (
                <SquadTab
                  team={team}
                  squad={
                    squads[team.id] ??
                    (team.league === 'International' || team.country === team.name
                      ? Object.values(squads)
                          .flat()
                          .filter((p) => !p.isCoach && p.nationality?.toLowerCase() === team.name.toLowerCase())
                      : [])
                  }
                />
              )}

              {activeTab === 'TRANSFERS' && (
                <TransfersTab team={team} transfers={transfers} />
              )}

              {activeTab === 'STATS' && (
                <TeamStatsTab
                  team={team}
                  squad={
                    squads[team.id] ??
                    (team.league === 'International' || team.country === team.name
                      ? Object.values(squads)
                          .flat()
                          .filter((p) => !p.isCoach && p.nationality?.toLowerCase() === team.name.toLowerCase())
                      : [])
                  }
                />
              )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </AppLayout>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
