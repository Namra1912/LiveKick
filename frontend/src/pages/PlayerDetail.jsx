// src/pages/PlayerDetail.jsx
import { useParams } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { transfers, topScorers, topAssists, squads } from '../data/mockData';
import './PlayerDetail.css';

export default function PlayerDetail() {
  const { id } = useParams();

  const player = (() => {
    if (!id) return null;
    const numId = Number(id);

    // 1. Search across all squad arrays in squads object (includes coaches and players)
    const allSquadMembers = Object.values(squads).flat();
    if (!isNaN(numId)) {
      const foundInSquad = allSquadMembers.find((p) => p.id === numId);
      if (foundInSquad) return foundInSquad;
    }

    const decoded = decodeURIComponent(id).trim();
    const normalized = decoded.toLowerCase().replace(/-/g, ' ');

    const foundInSquadByName = allSquadMembers.find(
      (p) =>
        p.name.toLowerCase() === normalized ||
        p.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );
    if (foundInSquadByName) return foundInSquadByName;

    // 2. Try finding in transfers by numeric id or name
    if (!isNaN(numId)) {
      const fromTransfer = transfers.find((t) => t.id === numId);
      if (fromTransfer) {
        return {
          id: fromTransfer.id,
          name: fromTransfer.player,
          position: fromTransfer.position,
          age: fromTransfer.age,
          team: fromTransfer.toTeam?.name || fromTransfer.fromTeam?.name,
        };
      }
    }

    const fromTransferByName = transfers.find(
      (t) =>
        t.player.toLowerCase() === normalized ||
        t.player.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );
    if (fromTransferByName) {
      return {
        id: fromTransferByName.id,
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

  const isCoach = Boolean(player?.isCoach || player?.position === 'Coach');
  const headingText = player?.name
    ? isCoach
      ? `${player.name}`
      : `${player.name}`
    : 'Player Profile';

  return (
    <AppLayout>
      <main className="stub-page">
        <h1 className="stub-page__heading">{headingText}</h1>
        {player && (
          <p className="stub-page__mono">
            {[
              isCoach ? 'Coach' : player.position,
              player.age ? `${player.age} yrs` : null,
              player.nationality || player.team,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}

        {isCoach ? (
          <p className="stub-page__body">Manager profile coming in Phase 1.</p>
        ) : (
          <>
            {player && (player.goals != null || player.assists != null || player.rating != null) && (
              <p className="stub-page__mono" style={{ marginTop: '12px' }}>
                {[
                  player.rating ? `Rating: ${player.rating}` : null,
                  player.goals != null ? `Goals: ${player.goals}` : null,
                  player.assists != null ? `Assists: ${player.assists}` : null,
                ]
                  .filter(Boolean)
                  .join(' | ')}
              </p>
            )}
            <p className="stub-page__body">Full player profile coming in Phase 1.</p>
          </>
        )}
      </main>
    </AppLayout>
  );
}
