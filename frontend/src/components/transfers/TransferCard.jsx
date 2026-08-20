// src/components/transfers/TransferCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Crest from '../shared/Crest';
import TierPill from './TierPill';
import './TransferCard.css';

function PlayerAvatar({ photo, name, position }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '??';

  return (
    <div className="transfer-card__avatar-wrap">
      {photo && !failed ? (
        <img
          src={photo}
          alt={name}
          className="transfer-card__avatar"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <div className="transfer-card__avatar-fallback">{initials}</div>
      )}
      <span className="transfer-card__position-badge">{position}</span>
    </div>
  );
}

function getFeeClass(fee) {
  const f = fee?.toLowerCase() ?? '';
  if (f === 'free' || f === 'loan') return 'transfer-card__fee transfer-card__fee--green';
  if (f === 'undisclosed') return 'transfer-card__fee transfer-card__fee--dim';
  return 'transfer-card__fee';
}

export default function TransferCard({ item, onSelectRow }) {
  const navigate = useNavigate();
  const isConfirmed = item.status === 'confirmed';
  const tier = Math.min(Math.max(item.tier, 1), 3);

  const cardClass = [
    'transfer-card',
    `transfer-card--tier-${tier}`,
    isConfirmed ? 'transfer-card--confirmed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClass}
      role="button"
      tabIndex={0}
      onClick={() => onSelectRow && onSelectRow(item)}
      onKeyDown={(e) => e.key === 'Enter' && onSelectRow && onSelectRow(item)}
    >
      {/* Col 1: Clubs */}
      <div className="transfer-card__clubs">
        <div
          className="transfer-card__club"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            if (item.fromTeam?.id) navigate('/teams/' + item.fromTeam.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              if (item.fromTeam?.id) navigate('/teams/' + item.fromTeam.id);
            }
          }}
        >
          <Crest team={item.fromTeam} size={22} />
          <span className="transfer-card__club-name">{item.fromTeam?.shortName ?? '?'}</span>
        </div>

        <ArrowRight size={10} className="transfer-card__arrow" />

        {item.toTeam ? (
          <div
            className="transfer-card__club"
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              if (item.toTeam?.id) navigate('/teams/' + item.toTeam.id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                if (item.toTeam?.id) navigate('/teams/' + item.toTeam.id);
              }
            }}
          >
            <Crest team={item.toTeam} size={22} />
            <span className="transfer-card__club-name">{item.toTeam?.shortName ?? '?'}</span>
          </div>
        ) : (
          <div className="transfer-card__club transfer-card__club--unknown">
            <div className="transfer-card__unknown-crest">?</div>
            <span className="transfer-card__club-name">Unknown</span>
          </div>
        )}
      </div>

      {/* Col 2: Player */}
      <div
        className="transfer-card__player"
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          navigate('/players/' + item.id);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            navigate('/players/' + item.id);
          }
        }}
      >
        <PlayerAvatar photo={item.playerPhoto} name={item.player} position={item.position} />
        <div className="transfer-card__player-info">
          <span className="transfer-card__player-name">
            {item.player}
            {isConfirmed && <span className="transfer-card__confirmed-dot" title="Confirmed" />}
          </span>
          <span className="transfer-card__player-meta">{item.position} · {item.age}</span>
        </div>
      </div>

      {/* Col 3: Fee */}
      <div className="transfer-card__fee-col">
        <span className={getFeeClass(item.fee)}>{item.fee}</span>
      </div>

      {/* Col 4: Tier */}
      <div className="transfer-card__tier-col">
        <TierPill tier={tier} />
      </div>

      {/* Col 5: Date */}
      <div className="transfer-card__date-col">
        <span className="transfer-card__date">{item.timestamp}</span>
        <ChevronRight size={12} className="transfer-card__hover-chevron" />
      </div>
    </div>
  );
}
