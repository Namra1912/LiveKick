// src/pages/TacticsLab.jsx — Stub placeholder (Phase 1)
import { FlaskConical } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StubPage from '../components/shared/StubPage';

export default function TacticsLab() {
  return (
    <AppLayout>
      <StubPage icon={<FlaskConical size={22} strokeWidth={1.75} />} heading="Tactical Lineup Lab">
        <p className="stub-page__body">
          Interactive pitch builder with drag-and-drop formations coming in Phase 1.
        </p>
      </StubPage>
    </AppLayout>
  );
}
