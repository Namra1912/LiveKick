// src/pages/TeamDetail.jsx — Team Profile Page (Scroll Wiring Fix)
import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Breadcrumb from '../components/shared/Breadcrumb';
import Crest from '../components/shared/Crest';
import SearchModal from '../components/search/SearchModal';
import StandingsTable from '../components/standings/StandingsTable';
import ArticleCard from '../components/news/ArticleCard';
import TeamForm from '../components/team-profile/TeamForm';
import TopPerformers from '../components/team-profile/TopPerformers';
import StartingXI from '../components/team-profile/StartingXI';
import FixtureDifficultyCard from '../components/team-profile/FixtureDifficultyCard';
import AboutSection from '../components/team-profile/AboutSection';
import { useFollowedTeams } from '../context/FollowedTeamsContext';
import { useLenisScroll } from '../hooks/useLenisScroll';
import { teams, leagues, news } from '../data/mockData';
import './TeamDetail.css';

const TABS = [
  { id: 'OVERVIEW', label: 'OVERVIEW', chunk: 'Chunk 2-4' },
  { id: 'FIXTURES', label: 'FIXTURES', chunk: 'Chunk 5' },
  { id: 'SQUAD', label: 'SQUAD', chunk: 'Chunk 7' },
  { id: 'TRANSFERS', label: 'TRANSFERS', chunk: 'Chunk 6' },
  { id: 'STATS', label: 'STATS', chunk: 'Chunk 8' },
];

export default function TeamDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
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

  // Filter 6 news articles for Barcelona
  const teamArticles = useMemo(() => {
    return news
      .filter((a) => a.teamId === team.id || a.team === 'barcelona')
      .slice(0, 6);
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

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Teams', path: '/' },
    { label: team.name },
  ];

  const currentTabObj = TABS.find((t) => t.id === activeTab) ?? TABS[0];

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

            {/* Navigation Tab Bar */}
            <nav className="team-profile__tab-bar" aria-label="Team section tabs">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`team-profile__tab-btn ${isActive ? 'team-profile__tab-btn--active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Tab Content Section */}
            {activeTab === 'OVERVIEW' ? (
              <section className="team-profile__overview-grid">
                {/* ── Center Column (Top to Bottom) ────────────────────── */}
                <div className="team-profile__center-col">
                  {/* 1. Team Form + Next Match (Side by Side Row) */}
                  <TeamForm team={team} />

                  {/* 2. League Table (Standings Embed) */}
                  <div className="team-profile__table-embed" data-highlight-team={team.id}>
                    <StandingsTable league={activeLeague} highlightTeamId={team.id} />
                  </div>

                  {/* 3. Top Rated / Top Scorers / Top Assists (3 Columns) */}
                  <TopPerformers team={team} />

                  {/* 4. Team News (2-Column Grid) */}
                  <div className="team-profile__news-card">
                    <div className="team-profile__news-header">
                      <span className="team-profile__news-title">TEAM NEWS</span>
                      <span className="team-profile__news-sub">{teamArticles.length} Articles</span>
                    </div>
                    <div className="team-profile__news-grid">
                      {teamArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>

                  {/* 5. About Section */}
                  <AboutSection team={team} />
                </div>

                {/* ── Right Column (Sticky, Top to Bottom) ────────────── */}
                <aside className="team-profile__right-col">
                  {/* 1. Starting XI Pitch Graphic */}
                  <StartingXI team={team} />

                  {/* 2 & 3. Fixture Difficulty + Upcoming Fixtures */}
                  <FixtureDifficultyCard team={team} />

                  {/* 4. Stadium Info Card */}
                  <div className="stadium-info-card">
                    <div className="stadium-info-card__header">
                      <span className="stadium-info-card__title">STADIUM INFO</span>
                    </div>
                    <div className="stadium-info-card__grid">
                      <div className="stadium-info-item">
                        <span className="stadium-info-item__label">VENUE</span>
                        <span className="stadium-info-item__val">{team.stadium ?? 'Spotify Camp Nou'}</span>
                      </div>
                      <div className="stadium-info-item">
                        <span className="stadium-info-item__label">CAPACITY</span>
                        <span className="stadium-info-item__val">{team.capacity ?? '99,354'}</span>
                      </div>
                      <div className="stadium-info-item">
                        <span className="stadium-info-item__label">OPENED</span>
                        <span className="stadium-info-item__val">{team.stadiumOpenedYear ?? '1957'}</span>
                      </div>
                      <div className="stadium-info-item">
                        <span className="stadium-info-item__label">SURFACE</span>
                        <span className="stadium-info-item__val">{team.stadiumSurface ?? 'Hybrid Grass'}</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </section>
            ) : (
              <section className="team-profile__content">
                <div className="team-profile__placeholder" role="status">
                  <span className="team-profile__placeholder-title">{currentTabObj.label}</span>
                  <p className="team-profile__placeholder-sub">
                    {currentTabObj.label} content coming in {currentTabObj.chunk}
                  </p>
                </div>
              </section>
            )}
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
