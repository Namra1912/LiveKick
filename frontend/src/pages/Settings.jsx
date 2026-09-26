// src/pages/Settings.jsx — Stub placeholder (Phase 1)
import { Settings as SettingsIcon } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StubPage from '../components/shared/StubPage';

export default function Settings() {
  return (
    <AppLayout>
      <StubPage icon={<SettingsIcon size={22} strokeWidth={1.75} />} heading="Settings">
        <p className="stub-page__body">
          Account settings and preferences coming in Phase 1.
        </p>
      </StubPage>
    </AppLayout>
  );
}
