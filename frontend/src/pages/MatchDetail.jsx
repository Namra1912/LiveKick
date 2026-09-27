// src/pages/MatchDetail.jsx
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, ListChecks, BarChart3, Swords } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Breadcrumb from '../components/shared/Breadcrumb';
import StubPage from '../components/shared/StubPage';
import MatchHeader from '../components/match/MatchHeader';
import MatchReviewCard from '../components/match/MatchReviewCard';
import MatchEventsList from '../components/match/MatchEventsList';
import MatchStatsCompare from '../components/match/MatchStatsCompare';
import MatchLineupPitch from '../components/match/MatchLineupPitch';
import MatchTableTab from '../components/match/MatchTableTab';
import MatchVenueCard from '../components/match/MatchVenueCard';
import MatchRoundFixtures from '../components/match/MatchRoundFixtures';
import MatchRelatedNews from '../components/match/MatchRelatedNews';
import MatchInsights from '../components/match/MatchInsights';
import MatchH2H from '../components/match/MatchH2H';
import { matches, matchEvents, matchStats, standings } from '../data/mockData';
import { pageIn, panelFade } from '../lib/motion';
import './MatchDetail.css';

const TABS = [
  { id: 'OVERVIEW', label: 'Overview' },
  { id: 'LINEUPS', label: 'Lineups' },
  { id: 'TABLE', label: 'Table' },
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

  // Facts computed entirely from real data already in the app — H2H meeting
  // count from the matches array, recent form from the live standings table.
  const facts = useMemo(() => {
    const list = [];
    const priorMeetings = matches.filter(
      (m) =>
        m.id !== match.id &&
        m.status === 'finished' &&
        ((m.homeTeam.id === match.homeTeam.id && m.awayTeam.id === match.awayTeam.id) ||
          (m.homeTeam.id === match.awayTeam.id && m.awayTeam.id === match.homeTeam.id))
    );
    list.push(
      priorMeetings.length > 0
        ? `This is meeting No. ${priorMeetings.length + 1} between ${match.homeTeam.name} and ${match.awayTeam.name}.`
        : `${match.homeTeam.name} and ${match.awayTeam.name} have not met before in recorded matches.`
    );

    const table = standings[match.league];
    const homeRow = table?.find((r) => r.team.id === match.homeTeam.id);
    const awayRow = table?.find((r) => r.team.id === match.awayTeam.id);
    if (homeRow) {
      const wins = homeRow.form.filter((r) => r === 'W').length;
      list.push(`${match.homeTeam.name} have won ${wins} of their last ${homeRow.form.length} league games.`);
    }
    if (awayRow) {
      const wins = awayRow.form.filter((r) => r === 'W').length;
      list.push(`${match.awayTeam.name} have won ${wins} of their last ${awayRow.form.length} league games.`);
    }
    return list;
  }, [match]);

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
                    <MatchReviewCard homeTeamId={match.homeTeam.id} awayTeamId={match.awayTeam.id} />
                    <section className="match-detail__card">
                      <h2 className="match-detail__card-title">
                        <ListChecks size={16} strokeWidth={2} /> Match Events
                      </h2>
                      <MatchEventsList events={events} />
                    </section>
                    <section className="match-detail__card">
                      <h2 className="match-detail__card-title">
                        <BarChart3 size={16} strokeWidth={2} /> Top Stats
                      </h2>
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

                {activeTab === 'TABLE' && <MatchTableTab match={match} />}

                {activeTab === 'STATS' && (
                  <section className="match-detail__card">
                    <h2 className="match-detail__card-title">
                      <BarChart3 size={16} strokeWidth={2} /> Match Stats
                    </h2>
                    <MatchStatsCompare stats={stats} homeColor={homeColor} awayColor={awayColor} />
                  </section>
                )}

                {activeTab === 'H2H' && (
                  <section className="match-detail__card">
                    <h2 className="match-detail__card-title">
                      <Swords size={16} strokeWidth={2} /> Head-to-Head
                    </h2>
                    <MatchH2H match={match} />
                  </section>
                )}
              </motion.div>
            </AnimatePresence>

            <aside className="match-detail__sidebar">
              <MatchVenueCard match={match} homeTeam={match.homeTeam} />
              <MatchInsights facts={facts} />
              <MatchRoundFixtures match={match} />
              <MatchRelatedNews homeTeamId={match.homeTeam.id} awayTeamId={match.awayTeam.id} />
            </aside>
          </div>
        </div>
      </motion.main>
    </AppLayout>
  );
}
