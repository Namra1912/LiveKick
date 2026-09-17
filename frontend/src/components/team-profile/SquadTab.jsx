// src/components/team-profile/SquadTab.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Flag from '../shared/Flag';
import { nationTeamId } from '../../data/mockData';
import './SquadTab.css';

// Preset colors for initials avatars (deterministic based on player.id % 6)
const AVATAR_COLORS = [
  '#00B370', // pitch green
  '#3b82f6', // blue
  '#f59e0b', // gold
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
];

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function parseTransferValue(valStr) {
  if (!valStr) return null;
  const clean = valStr.replace('€', '').trim();
  if (clean.endsWith('M')) {
    return parseFloat(clean.slice(0, -1)) * 1_000_000;
  }
  if (clean.endsWith('K')) {
    return parseFloat(clean.slice(0, -1)) * 1_000;
  }
  return parseFloat(clean) || null;
}

const POSITION_ORDER = {
  Coach: -1,
  GK: 0,
  // DEF (1)
  CB: 1,
  RB: 1,
  LB: 1,
  RWB: 1,
  LWB: 1,
  DEF: 1,
  // MID (2)
  CDM: 2,
  CM: 2,
  AM: 2,
  LM: 2,
  RM: 2,
  MID: 2,
  // FWD (3)
  ST: 3,
  CF: 3,
  LW: 3,
  RW: 3,
  FWD: 3,
};

function getPositionOrder(posStr) {
  if (!posStr) return 99;
  if (posStr === 'Coach') return -1;
  const firstCode = posStr.split(',')[0].trim();
  return POSITION_ORDER[firstCode] ?? 99;
}

function getPositionGroupModifier(player) {
  if (player.isCoach || player.position === 'Coach') return 'squad-table__row--coach';
  const order = getPositionOrder(player.position);
  if (order === 0) return 'squad-table__row--gk';
  if (order === 1) return 'squad-table__row--def';
  if (order === 2) return 'squad-table__row--mid';
  if (order === 3) return 'squad-table__row--fwd';
  return '';
}

export default function SquadTab({ team, squad = [] }) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (playerId) => {
    setFailedImages((prev) => ({ ...prev, [playerId]: true }));
  };

  const handleHeaderClick = (key) => {
    if (sortKey === key) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortKey(null);
        setSortDir('asc');
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedSquad = useMemo(() => {
    if (!squad || squad.length === 0) return [];

    // Separate coach and players
    const coach = squad.find((p) => p.isCoach || p.position === 'Coach');
    const players = squad.filter((p) => !(p.isCoach || p.position === 'Coach'));

    let sorted = [...players];

    if (sortKey === null) {
      // Default order: position group (GK -> DEF -> MID -> FWD) then shirtNumber asc
      sorted.sort((a, b) => {
        const posA = getPositionOrder(a.position);
        const posB = getPositionOrder(b.position);
        if (posA !== posB) return posA - posB;
        const shirtA = a.shirtNumber ?? 999;
        const shirtB = b.shirtNumber ?? 999;
        return shirtA - shirtB;
      });
    } else {
      sorted.sort((a, b) => {
        let valA, valB;

        if (sortKey === 'position') {
          valA = getPositionOrder(a.position);
          valB = getPositionOrder(b.position);
        } else if (sortKey === 'nationality') {
          valA = a.nationality || '';
          valB = b.nationality || '';
        } else if (sortKey === 'shirtNumber') {
          valA = a.shirtNumber;
          valB = b.shirtNumber;
        } else if (sortKey === 'age') {
          valA = a.age;
          valB = b.age;
        } else if (sortKey === 'height') {
          valA = a.height;
          valB = b.height;
        } else if (sortKey === 'transferValue') {
          valA = parseTransferValue(a.transferValue);
          valB = parseTransferValue(b.transferValue);
        }

        // Always put null / undefined at bottom
        if (valA == null && valB == null) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        let comp = 0;
        if (typeof valA === 'string') {
          comp = valA.localeCompare(valB);
        } else {
          comp = valA < valB ? -1 : valA > valB ? 1 : 0;
        }

        return sortDir === 'asc' ? comp : -comp;
      });
    }

    // Coach row ALWAYS stays at the top
    return coach ? [coach, ...sorted] : sorted;
  }, [squad, sortKey, sortDir]);

  if (!squad || squad.length === 0) {
    return null;
  }

  const renderSortIndicator = (key) => {
    if (sortKey !== key) return null;
    return <span className="squad-table__sort-icon">{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>;
  };

  return (
    <div className="squad-tab">
      <table className="squad-table">
        <colgroup>
          <col style={{ width: '34%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '6%' }} />
          <col style={{ width: '6%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '16%' }} />
        </colgroup>
        <thead className="squad-table__head">
          <tr>
            <th className="squad-table__th squad-table__th--player">Player</th>
            <th
              className={`squad-table__th squad-table__th--sortable ${sortKey === 'position' ? 'squad-table__th--active' : ''}`}
              onClick={() => handleHeaderClick('position')}
            >
              Position{renderSortIndicator('position')}
            </th>
            <th
              className={`squad-table__th squad-table__th--sortable ${sortKey === 'nationality' ? 'squad-table__th--active' : ''}`}
              onClick={() => handleHeaderClick('nationality')}
            >
              Country{renderSortIndicator('nationality')}
            </th>
            <th
              className={`squad-table__th squad-table__th--sortable squad-table__th--center ${sortKey === 'shirtNumber' ? 'squad-table__th--active' : ''}`}
              onClick={() => handleHeaderClick('shirtNumber')}
            >
              Shirt{renderSortIndicator('shirtNumber')}
            </th>
            <th
              className={`squad-table__th squad-table__th--sortable squad-table__th--center ${sortKey === 'age' ? 'squad-table__th--active' : ''}`}
              onClick={() => handleHeaderClick('age')}
            >
              Age{renderSortIndicator('age')}
            </th>
            <th
              className={`squad-table__th squad-table__th--sortable squad-table__th--center ${sortKey === 'height' ? 'squad-table__th--active' : ''}`}
              onClick={() => handleHeaderClick('height')}
            >
              Height{renderSortIndicator('height')}
            </th>
            <th
              className={`squad-table__th squad-table__th--sortable squad-table__th--right ${sortKey === 'transferValue' ? 'squad-table__th--active' : ''}`}
              onClick={() => handleHeaderClick('transferValue')}
            >
              Transfer Value{renderSortIndicator('transferValue')}
            </th>
          </tr>
        </thead>
        <tbody className="squad-table__body">
          {sortedSquad.map((player) => {
            const initials = getInitials(player.name);
            const avatarBg = AVATAR_COLORS[Math.abs(player.id) % AVATAR_COLORS.length];
            const hasPhoto = player.photoUrl && !failedImages[player.id];
            const roleGroupClass = getPositionGroupModifier(player);
            const nationId = nationTeamId(player.nationality);

            return (
              <tr
                key={player.id}
                className={`squad-table__row ${roleGroupClass}`}
              >
                <td className="squad-table__td squad-table__td--player">
                  <div
                    className="squad-table__player-link"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/players/${player.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/players/${player.id}`);
                      }
                    }}
                  >
                    <div className="squad-table__avatar-container">
                      {hasPhoto ? (
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="squad-table__avatar-img"
                          onError={() => handleImageError(player.id)}
                        />
                      ) : (
                        <div
                          className="squad-table__avatar-initials"
                          style={{ backgroundColor: avatarBg }}
                        >
                          {initials}
                        </div>
                      )}
                      {player.injury && (
                        <span
                          className="squad-table__injury-badge"
                          title={player.injury}
                          aria-label="Injured"
                        >
                          <svg
                            className="squad-table__injury-icon"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 2.5V9.5M2.5 6H9.5"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="squad-table__player-info">
                      <span className="squad-table__player-name">
                        {player.name}
                      </span>
                      {player.injury && (
                        <span className="squad-table__injury-text">
                          {player.injury}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="squad-table__td squad-table__td--position">
                  {player.position}
                </td>
                <td className="squad-table__td squad-table__td--country">
                  {nationId ? (
                    <div
                      className="squad-table__country-link"
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/teams/${nationId}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/teams/${nationId}`);
                        }
                      }}
                    >
                      <Flag nationality={player.nationality} size={20} />
                      <span className="squad-table__country-name">{player.nationality}</span>
                    </div>
                  ) : (
                    <div className="squad-table__country-cell">
                      <Flag nationality={player.nationality} size={20} />
                      <span className="squad-table__country-name">{player.nationality}</span>
                    </div>
                  )}
                </td>
                <td className="squad-table__td squad-table__td--center squad-table__td--shirt">
                  {player.shirtNumber ?? ''}
                </td>
                <td className="squad-table__td squad-table__td--center squad-table__td--age">
                  {player.age ?? ''}
                </td>
                <td className="squad-table__td squad-table__td--center squad-table__td--height">
                  {player.height ? `${player.height} cm` : '—'}
                </td>
                <td className="squad-table__td squad-table__td--right squad-table__td--value">
                  {player.transferValue ?? '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
