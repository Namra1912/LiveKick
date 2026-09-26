// src/pages/MatchDetail.jsx — Stub placeholder (Phase 1)
import { useParams } from 'react-router-dom';
import { Goal } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StubPage from '../components/shared/StubPage';
import { matches } from '../data/mockData';

export default function MatchDetail() {
  const { id } = useParams();
  const match = matches.find((m) => m.id === Number(id));

  return (
    <AppLayout>
      <StubPage
        icon={<Goal size={22} strokeWidth={1.75} />}
        heading={match ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : 'Match Detail'}
        monoLine={
          match
            ? `${match.homeScore} – ${match.awayScore} · ${match.status === 'live' ? `${match.minute}'` : match.status.toUpperCase()}`
            : null
        }
      >
        <p className="stub-page__body">
          Full match detail (timeline, lineups, stats) coming in Phase 1.
        </p>
      </StubPage>
    </AppLayout>
  );
}
