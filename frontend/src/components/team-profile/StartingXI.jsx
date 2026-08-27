// src/components/team-profile/StartingXI.jsx
import { useMemo } from 'react';
import { squads } from '../../data/mockData';
import './StartingXI.css';

export default function StartingXI({ team }) {
  const squad = useMemo(() => squads[team?.id] ?? [], [team]);

  // Map 11 player IDs from lastMatchXI into player objects
  const startingPlayers = useMemo(() => {
    const ids = team?.lastMatchXI ?? [901, 905, 907, 904, 909, 912, 914, 915, 921, 919, 923];
    return ids.map((id) => squad.find((p) => p.id === id)).filter(Boolean);
  }, [team, squad]);

  // Split starting XI into formation rows (for 4-3-3: GK=1, DEF=4, MID=3, FWD=3)
  const rows = useMemo(() => {
    if (startingPlayers.length < 11) {
      return {
        gk: startingPlayers.slice(0, 1),
        def: startingPlayers.slice(1, 5),
        mid: startingPlayers.slice(5, 8),
        fwd: startingPlayers.slice(8, 11),
      };
    }

    return {
      gk: [startingPlayers[0]],
      def: [startingPlayers[1], startingPlayers[2], startingPlayers[3], startingPlayers[4]],
      mid: [startingPlayers[5], startingPlayers[6], startingPlayers[7]],
      fwd: [startingPlayers[8], startingPlayers[9], startingPlayers[10]],
    };
  }, [startingPlayers]);

  return (
    <div className="starting-xi-card">
      <div className="starting-xi-card__header">
        <div className="starting-xi-card__header-left">
          <span className="starting-xi-card__title">STARTING XI</span>
          <span className="starting-xi-card__formation">{team?.formation ?? '4-3-3'}</span>
        </div>
        <span className="starting-xi-card__sub">Last Match Lineup</span>
      </div>

      {/* Pitch graphic container */}
      <div className="starting-xi-pitch">
        {/* Tactical pitch lines */}
        <div className="starting-xi-pitch__lines">
          <div className="starting-xi-pitch__penalty-top" />
          <div className="starting-xi-pitch__center-line" />
          <div className="starting-xi-pitch__center-circle" />
          <div className="starting-xi-pitch__penalty-bottom" />
        </div>

        {/* Player Formation Rows (top-to-bottom: Attack -> Midfield -> Defense -> GK) */}
        <div className="starting-xi-pitch__squad">
          {/* Forwards Row */}
          <div className="starting-xi-row starting-xi-row--fwd">
            {rows.fwd.map((p) => (
              <PlayerNode key={p.id} player={p} />
            ))}
          </div>

          {/* Midfielders Row */}
          <div className="starting-xi-row starting-xi-row--mid">
            {rows.mid.map((p) => (
              <PlayerNode key={p.id} player={p} />
            ))}
          </div>

          {/* Defenders Row */}
          <div className="starting-xi-row starting-xi-row--def">
            {rows.def.map((p) => (
              <PlayerNode key={p.id} player={p} />
            ))}
          </div>

          {/* Goalkeeper Row */}
          <div className="starting-xi-row starting-xi-row--gk">
            {rows.gk.map((p) => (
              <PlayerNode key={p.id} player={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerNode({ player }) {
  const shortName = player.name.split(' ').pop();
  return (
    <div className="starting-xi-player">
      <div className="starting-xi-player__avatar-wrap">
        <div className="starting-xi-player__avatar">
          <span className="starting-xi-player__number">{player.shirtNumber}</span>
        </div>
        {player.rating && (
          <span className="starting-xi-player__rating-badge">
            {player.rating.toFixed(1)}
          </span>
        )}
      </div>
      <span className="starting-xi-player__name">{shortName}</span>
    </div>
  );
}
