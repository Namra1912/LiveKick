// src/pages/PredictionsLeague.jsx — Stub placeholder (Phase 1)
import { Trophy } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StubPage from '../components/shared/StubPage';

export default function PredictionsLeague() {
  return (
    <AppLayout>
      <StubPage icon={<Trophy size={22} strokeWidth={1.75} />} heading="Fan Prediction League">
        <p className="stub-page__body">
          Global and Friends leaderboards, Matchday Coins history coming in Phase 1.
        </p>
      </StubPage>
    </AppLayout>
  );
}
