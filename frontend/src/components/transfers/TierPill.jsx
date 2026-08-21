// src/components/transfers/TierPill.jsx
import './TierPill.css';

export default function TierPill({ tier }) {
  const safeTier = [1, 2, 3].includes(tier) ? tier : 3;

  return (
    <span className={`tier-pill tier-pill--${safeTier}`}>
      Tier {safeTier}
    </span>
  );
}
