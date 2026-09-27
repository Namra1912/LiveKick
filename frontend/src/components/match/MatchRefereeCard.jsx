// src/components/match/MatchRefereeCard.jsx
import { Square, ShieldAlert } from 'lucide-react';
import { refereeStats, leagues } from '../../data/mockData';
import Crest from '../shared/Crest';
import './MatchRefereeCard.css';

// Season-wide baselines to compare a referee's own average against — same
// idea as the reference's "Above average / Average" label, computed from
// the small curated refereeStats set rather than a single hardcoded number.
const LEAGUE_AVG_CARDS = 4.0;
const LEAGUE_AVG_FOULS = 21.0;

function getInitials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function Gauge({ icon: Icon, label, value, suffix, leagueAvg, higherIsMore }) {
  const pct = Math.min(100, Math.max(0, (value / (leagueAvg * 2)) * 100));
  const isAbove = higherIsMore ? value > leagueAvg : value < leagueAvg;

  return (
    <div className="match-referee-card__gauge">
      <div className="match-referee-card__gauge-head">
        <Icon size={13} strokeWidth={2} />
        <span>{label}</span>
      </div>
      <span className="match-referee-card__gauge-value">{value.toFixed(1)}{suffix}</span>
      <div className="match-referee-card__gauge-track">
        <span className="match-referee-card__gauge-fill" style={{ width: `${pct}%` }} />
        <span className="match-referee-card__gauge-dot" style={{ left: `${pct}%` }} />
      </div>
      <span className={`match-referee-card__gauge-label ${isAbove ? 'match-referee-card__gauge-label--above' : ''}`}>
        {isAbove ? 'Above average' : 'Average'}
      </span>
    </div>
  );
}

export default function MatchRefereeCard({ referee, league }) {
  if (!referee) return null;
  const stats = refereeStats[referee];
  const leagueObj = leagues.find((l) => l.name === league);

  return (
    <div className="match-referee-card">
      <h2 className="match-detail__card-title">Referee</h2>
      <div className="match-referee-card__profile">
        <span className="match-referee-card__avatar-ring">
          <span className="match-referee-card__avatar">{getInitials(referee)}</span>
        </span>
        <span className="match-referee-card__name">{referee}</span>
      </div>

      {stats && (
        <div className="match-referee-card__gauges">
          <Gauge
            icon={Square}
            label="Yellow cards"
            value={stats.cardsPerMatch}
            suffix=" / match"
            leagueAvg={LEAGUE_AVG_CARDS}
            higherIsMore
          />
          <Gauge
            icon={ShieldAlert}
            label="Fouls"
            value={stats.foulsPerMatch}
            suffix=" / match"
            leagueAvg={LEAGUE_AVG_FOULS}
            higherIsMore
          />
        </div>
      )}

      {league && (
        <div className="match-referee-card__league">
          {leagueObj?.logoUrl && <Crest logoUrl={leagueObj.logoUrl} name={league} size={16} />}
          <span>{league}</span>
        </div>
      )}
    </div>
  );
}
