// src/pages/TeamDetail.jsx — Team Profile Page
import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Breadcrumb from '../components/shared/Breadcrumb';
import Crest from '../components/shared/Crest';
import SearchModal from '../components/search/SearchModal';
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
import { useFollowedTeams } from '../context/FollowedTeamsContext';
import { useLenisScroll } from '../hooks/useLenisScroll';
import { teams, leagues, news, matches } from '../data/mockData';
import './TeamDetail.css';

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
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const { isFollowing, toggleFollow } = useFollowedTeams();

  // Scroll container refs & Lenis smooth scroll hook
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const tabBarRef = useRef(null);
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

  // Sliding tab indicator — updates position whenever activeTab changes
  useEffect(() => {
    if (!tabBarRef.current) return;
    const activeEl = tabBarRef.current.querySelector(`[data-tab="${activeTab}"]`);
    if (!activeEl) return;
    const { offsetLeft, offsetWidth } = activeEl;
    setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
  }, [activeTab]);

  // IntersectionObserver for section reveal animations — fires once per element
  useEffect(() => {
    const targets = document.querySelectorAll('.section-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]); // re-run when tab changes so newly mounted sections get observed

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

            {/* Clean Header Card */}
            <header className="team-header__card">
              <div className="team-header__main">
                <Crest
                  logoUrl={team.logoUrl ?? team.crestUrl}
                  name={team.name}
                  size={60}
                />
                <div className="team-header__info">
                  <h1 className="team-header__name">{team.name}</h1>
                  <p className="team-header__subtitle">{team.league}</p>
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
              ref={tabBarRef}
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
                  </button>
                );
              })}
              {/* Sliding green indicator — absolutely positioned inside the tab bar */}
              <div className="tab-indicator" style={indicatorStyle} />
            </nav>

            {/* Tab Content Section — key forces remount → re-triggers fade animation */}
            <div key={activeTab} className="tab-content-panel">
              {activeTab === 'OVERVIEW' && (
                <section className="team-profile__overview-grid">
                  {/* ── Center Column (Top to Bottom) ────────────────────── */}
                  <div className="team-profile__center-col">
                    {/* 1. Team Form */}
                    <div className="section-reveal" style={{ transitionDelay: '0ms' }}>
                      <TeamForm team={team} />
                    </div>

                    {/* 2. League Table */}
                    <div
                      className="section-reveal team-profile__table-embed"
                      data-highlight-team={team.id}
                      style={{ transitionDelay: '60ms' }}
                    >
                      <StandingsTable league={activeLeague} highlightTeamId={team.id} />
                    </div>

                    {/* 3. Top Performers */}
                    <div className="section-reveal" style={{ transitionDelay: '120ms' }}>
                      <TopPerformers team={team} />
                    </div>

                    {/* 4. Team News Card */}
                    <div className="section-reveal" style={{ transitionDelay: '180ms' }}>
                      <TeamNews
                        articles={teamArticles}
                        onSeeMore={() => navigate(`/teams/${id}/news`)}
                      />
                    </div>

                    {/* 5. About Section */}
                    <div className="section-reveal" style={{ transitionDelay: '240ms' }}>
                      <AboutSection team={team} />
                    </div>
                  </div>

                  {/* ── Right Column (Sticky, Top to Bottom) ────────────── */}
                  <aside className="team-profile__right-col">
                    {/* 1. Starting XI Pitch Graphic */}
                    <div className="section-reveal" style={{ transitionDelay: '0ms' }}>
                      <StartingXI team={team} />
                    </div>

                    {/* 2 & 3. Fixture Difficulty + Upcoming Fixtures */}
                    <div className="section-reveal" style={{ transitionDelay: '60ms' }}>
                      <FixtureDifficultyCard team={team} />
                    </div>

                    {/* 4. Stadium Info Card */}
                    <div className="section-reveal" style={{ transitionDelay: '120ms' }}>
                      <StadiumInfoCard team={team} />
                    </div>
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
                <section className="team-profile__content">
                  <div className="team-profile__placeholder" role="status">
                    <span className="team-profile__placeholder-title">SQUAD</span>
                    <p className="team-profile__placeholder-sub">Coming soon</p>
                  </div>
                </section>
              )}

              {activeTab === 'TRANSFERS' && (
                <section className="team-profile__content">
                  <div className="team-profile__placeholder" role="status">
                    <span className="team-profile__placeholder-title">TRANSFERS</span>
                    <p className="team-profile__placeholder-sub">Coming soon</p>
                  </div>
                </section>
              )}

              {activeTab === 'STATS' && (
                <section className="team-profile__content">
                  <div className="team-profile__placeholder" role="status">
                    <span className="team-profile__placeholder-title">STATS</span>
                    <p className="team-profile__placeholder-sub">Coming soon</p>
                  </div>
                </section>
              )}
            </div>
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
