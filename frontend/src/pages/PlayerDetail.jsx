// src/pages/PlayerDetail.jsx — Stub placeholder (Phase 1)
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { transfers, topScorers, topAssists } from '../data/mockData';
import './PlayerDetail.css';

export default function PlayerDetail() {
  const { id } = useParams();

  // Helper lookup for player from mock data
  const player = (() => {
    if (!id) return null;
    const numId = Number(id);

    // 1. Try finding in transfers by numeric id (e.g. transfer id)
    if (!isNaN(numId)) {
      const fromTransfer = transfers.find((t) => t.id === numId);
      if (fromTransfer) {
        return {
          name: fromTransfer.player,
          position: fromTransfer.position,
          age: fromTransfer.age,
          team: fromTransfer.toTeam?.name || fromTransfer.fromTeam?.name,
        };
      }
    }

    // 2. Try finding in transfers by name or slug match
    const decoded = decodeURIComponent(id).trim();
    const normalized = decoded.toLowerCase().replace(/-/g, ' ');
    const fromTransferByName = transfers.find(
      (t) =>
        t.player.toLowerCase() === normalized ||
        t.player.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );
    if (fromTransferByName) {
      return {
        name: fromTransferByName.player,
        position: fromTransferByName.position,
        age: fromTransferByName.age,
        team: fromTransferByName.toTeam?.name || fromTransferByName.fromTeam?.name,
      };
    }

    // 3. Try finding in topScorers / topAssists
    for (const list of Object.values(topScorers)) {
      const found = list.find(
        (p) =>
          p.name.toLowerCase() === normalized ||
          p.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
      );
      if (found) {
        return {
          name: found.name,
          position: null,
          age: null,
          team: found.team?.name,
        };
      }
    }
    for (const list of Object.values(topAssists)) {
      const found = list.find(
        (p) =>
          p.name.toLowerCase() === normalized ||
          p.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
      );
      if (found) {
        return {
          name: found.name,
          position: null,
          age: null,
          team: found.team?.name,
        };
      }
    }

    // Fallback: if string id is provided, format it
    if (isNaN(numId)) {
      return { name: decoded };
    }

    return null;
  })();

  const headingText = player?.name ? `${player.name} Profile` : 'Player Profile';

  return (
    <AppLayout>
      <main className="stub-page">
        <h1 className="stub-page__heading">{headingText}</h1>
        {player && (player.position || player.team || player.age) && (
          <p className="stub-page__mono">
            {[player.position, player.age ? `${player.age} yrs` : null, player.team]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        <p className="stub-page__body">Full player profile coming in Phase 1.</p>
      </main>
    </AppLayout>
  );
}
