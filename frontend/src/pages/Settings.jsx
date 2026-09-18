// src/pages/Settings.jsx — Stub placeholder (Phase 1)
import { Settings as SettingsIcon } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import '../styles/StubPage.css';

export default function Settings() {
  return (
    <AppLayout>
      <main className="stub-page">
        <div className="stub-page__panel">
          <div className="stub-page__icon">
            <SettingsIcon size={22} strokeWidth={1.75} />
          </div>
          <h1 className="stub-page__heading">Settings</h1>
          <p className="stub-page__body">
            Account settings and preferences coming in Phase 1.
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
