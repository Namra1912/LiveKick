// src/components/shared/Crest.jsx
// TASK A — Shared crest component used by both LeagueGroup and MatchRow.
// Shows a real logo image when logoUrl is provided and loads successfully.
// Falls back to a deterministic-color monogram when the URL is null/fails.

import { useState } from 'react';
import './Crest.css';

// Deterministic hue from name — same entity always gets the same fallback color.
// Pure string hash; no external dependency needed.
function nameToHue(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function initials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Crest({ logoUrl, name, size = 24 }) {
  const [failed, setFailed] = useState(false);
  const showImage = logoUrl && !failed;

  if (showImage) {
    return (
      <img
        src={logoUrl}
        alt={`${name} crest`}
        className="crest crest--img"
        style={{ width: size, height: size }}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  // Fallback: deterministic HSL monogram — no external service needed
  return (
    <div
      className="crest crest--fallback"
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${nameToHue(name)}, 45%, 40%)`,
        fontSize: size * 0.4,
      }}
      aria-label={`${name} crest`}
    >
      {initials(name)}
    </div>
  );
}
