// src/pages/MatchDetail.jsx — Stub placeholder (Phase 1)
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { matches } from '../data/mockData';
import '../styles/StubPage.css';

export default function MatchDetail() {
  const { id } = useParams();
  const match = matches.find((m) => m.id === Number(id));

  return (
    <AppLayout>
      <main className="stub-page">
        <h1 className="stub-page__heading">
          {match
            ? `${match.homeTeam.name} vs ${match.awayTeam.name}`
            : 'Match Detail'}
        </h1>
        {match && (
          <p className="stub-page__mono">
            {match.homeScore} – {match.awayScore} · {match.status === 'live' ? `${match.minute}'` : match.status.toUpperCase()}
          </p>
        )}
        <p className="stub-page__body">
          Full match detail (timeline, lineups, stats) coming in Phase 1.
        </p>
      </main>
    </AppLayout>
  );
}
