// src/pages/MatchDetail.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Breadcrumb from '../components/shared/Breadcrumb';
import StubPage from '../components/shared/StubPage';
import MatchHeader from '../components/match/MatchHeader';
import MatchEventsList from '../components/match/MatchEventsList';
import MatchStatsCompare from '../components/match/MatchStatsCompare';
import MatchLineupPitch from '../components/match/MatchLineupPitch';
import MatchVenueCard from '../components/match/MatchVenueCard';
import MatchH2H from '../components/match/MatchH2H';
import { matches, matchEvents, matchStats } from '../data/mockData';
import { pageIn, panelFade } from '../lib/motion';
import './MatchDetail.css';

const TABS = [
  { id: 'OVERVIEW', label: 'Overview' },
  { id: 'LINEUPS', label: 'Lineups' },
  { id: 'STATS', label: 'Stats' },
  { id: 'H2H', label: 'Head-to-Head' },
];

export default function MatchDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const match = matches.find((m) => m.id === Number(id));

  if (!match) {
    return (
      <AppLayout>
        <StubPage icon={<Goal size={22} strokeWidth={1.75} />} heading="Match Detail">
          <p className="stub-page__body">This match couldn&apos;t be found.</p>
        </StubPage>
      </AppLayout>
    );
  }

  const events = matchEvents[match.id];
  const stats = matchStats[match.id];
  const homeColor = match.homeTeam.primaryColor || '#00B370';
  const awayColor = match.awayTeam.primaryColor || '#3b82f6';

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Matches', path: '/' },
    { label: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}` },
  ];

  return (
    <AppLayout>
      <motion.main className="match-detail" initial="hidden" animate="show" variants={pageIn}>
        <div className="match-detail__inner">
          <Breadcrumb items={breadcrumbItems} />

          <MatchHeader match={match} tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="match-detail__body">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="match-detail__main"
                initial="hidden"
                animate="show"
                exit="exit"
                variants={panelFade}
              >
                {activeTab === 'OVERVIEW' && (
                  <>
                    <section className="match-detail__card">
                      <h2 className="match-detail__card-title">Match Events</h2>
                      <MatchEventsList events={events} />
                    </section>
                    <section className="match-detail__card">
                      <h2 className="match-detail__card-title">Top Stats</h2>
                      <MatchStatsCompare stats={stats} homeColor={homeColor} awayColor={awayColor} limit={4} />
                    </section>
                  </>
                )}

                {activeTab === 'LINEUPS' && (
                  <MatchLineupPitch
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                    homeFormation={match.homeTeam.formation}
                    awayFormation={match.awayTeam.formation}
                  />
                )}

                {activeTab === 'STATS' && (
                  <section className="match-detail__card">
                    <h2 className="match-detail__card-title">Match Stats</h2>
                    <MatchStatsCompare stats={stats} homeColor={homeColor} awayColor={awayColor} />
                  </section>
                )}

                {activeTab === 'H2H' && (
                  <section className="match-detail__card">
                    <h2 className="match-detail__card-title">Head-to-Head</h2>
                    <MatchH2H match={match} />
                  </section>
                )}
              </motion.div>
            </AnimatePresence>

            <aside className="match-detail__sidebar">
              <MatchVenueCard match={match} homeTeam={match.homeTeam} />
            </aside>
          </div>
        </div>
      </motion.main>
    </AppLayout>
  );
}
