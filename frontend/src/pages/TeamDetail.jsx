// src/pages/TeamDetail.jsx — Stub placeholder (Phase 1)
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { teams } from '../data/mockData';
import '../styles/StubPage.css';

export default function TeamDetail() {
  const { id } = useParams();
  const team = teams.find((t) => t.id === Number(id));

  return (
    <AppLayout>
      <main className="stub-page">
        <h1 className="stub-page__heading">{team?.name ?? 'Team'} Profile</h1>
        <p className="stub-page__body">Full team profile coming in Phase 1.</p>
      </main>
    </AppLayout>
  );
}
