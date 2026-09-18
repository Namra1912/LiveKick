// src/pages/PredictionsLeague.jsx — Stub placeholder (Phase 1)
import { Trophy } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import '../styles/StubPage.css';

export default function PredictionsLeague() {
  return (
    <AppLayout>
      <main className="stub-page">
        <div className="stub-page__panel">
          <div className="stub-page__icon">
            <Trophy size={22} strokeWidth={1.75} />
          </div>
          <h1 className="stub-page__heading">Fan Prediction League</h1>
          <p className="stub-page__body">
            Global and Friends leaderboards, Matchday Coins history coming in Phase 1.
          </p>
          <span className="stub-page__badge">
            <span className="stub-page__badge-dot" />
            Coming soon
          </span>
        </div>
      </main>
    </AppLayout>
  );
}
