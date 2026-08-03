// src/components/panels/PredictorCard.jsx
// Fan Matchday Predictor — outlined pill buttons, amber highlight, disclaimer

import { useState } from 'react';
import CoinIcon from '../icons/CoinIcon';
import './PredictorCard.css';

function formatLockTime(isoString) {
  if (!isoString) return '–:–';
  const d = new Date(isoString);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function VoteButton({ label, value, selected, onClick }) {
  const isSelected = selected === value;
  return (
    <button
      id={`predictor-vote-${value}`}
      className={`predictor-card__vote-btn${isSelected ? ' predictor-card__vote-btn--selected' : ''}`}
      onClick={() => onClick(isSelected ? null : value)}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}

export default function PredictorCard({ predictorMatch, coinRules }) {
  const [selectedVote, setSelectedVote] = useState(predictorMatch?.userPick ?? null);

  if (!predictorMatch) return null;

  const { homeTeam, awayTeam, lockAt } = predictorMatch;

  return (
    <article className="predictor-card">
      {/* Header row */}
      <div className="predictor-card__header">
        <span className="predictor-card__header-label">Fan Predictor</span>
        <div className="predictor-card__coin-row">
          <CoinIcon size={13} />
          <span className="predictor-card__coin-amount">
            +{coinRules.correctResult} Coins
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="predictor-card__body">
        {/* Match title */}
        <p className="predictor-card__match-title">
          {homeTeam?.name} vs {awayTeam?.name}
        </p>

        {/* Vote buttons */}
        <div className="predictor-card__votes">
          <VoteButton label="Home" value="home" selected={selectedVote} onClick={setSelectedVote} />
          <VoteButton label="Draw" value="draw" selected={selectedVote} onClick={setSelectedVote} />
          <VoteButton label="Away" value="away" selected={selectedVote} onClick={setSelectedVote} />
        </div>

        {/* Coin detail */}
        <div className="predictor-card__coin-detail">
          <CoinIcon size={12} />
          <span className="predictor-card__coin-detail-text">
            +{coinRules.correctResult} Coins · +{coinRules.exactScore} exact score
          </span>
        </div>

        {/* Lock notice */}
        <p className="predictor-card__lock-notice">
          Locks at kickoff — {formatLockTime(lockAt)}
        </p>

        {/* Required legal disclaimer */}
        <p className="predictor-card__disclaimer">
          Matchday Coins are virtual in-game tokens for entertainment only
          and hold no real-world monetary value.
        </p>
      </div>
    </article>
  );
}
