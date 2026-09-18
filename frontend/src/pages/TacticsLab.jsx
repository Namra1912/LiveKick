// src/pages/TacticsLab.jsx — Stub placeholder (Phase 1)
import { FlaskConical } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import '../styles/StubPage.css';

export default function TacticsLab() {
  return (
    <AppLayout>
      <main className="stub-page">
        <div className="stub-page__panel">
          <div className="stub-page__icon">
            <FlaskConical size={22} strokeWidth={1.75} />
          </div>
          <h1 className="stub-page__heading">Tactical Lineup Lab</h1>
          <p className="stub-page__body">
            Interactive pitch builder with drag-and-drop formations coming in Phase 1.
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
