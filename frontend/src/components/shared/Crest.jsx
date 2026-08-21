// src/components/shared/Crest.jsx
/**
 * CANONICAL CREST COMPONENT
 *
 * Component Kept: Crest (components/shared/Crest.jsx)
 * Component Removed: TeamBadge (formerly defined in components/layout/Sidebar.jsx)
 * Consumer Files Updated:
 *   1. Sidebar.jsx — Replaced TeamBadge import/definition with Crest (size 30 for My Teams)
 *   2. MatchOfTheDayCard.jsx — Replaced TeamBadge import & usage with Crest (size 42)
 *   3. PredictorCard.jsx — Replaced/verified Crest import & usage (size 44)
 *   4. MatchRow.jsx — Replaced/verified Crest import & usage (size 20)
 *   5. SearchModal.jsx — Verified imports; ready for crest rendering in search results
 *
 * Sizing Translation & Capabilities:
 * - Supports numeric pixel sizes (e.g. 18, 20, 30, 42, 44) or string presets ('sm': 20, 'md': 30, 'lg': 42).
 * - Accepts direct logoUrl & name props OR a team object ({ logoUrl, crestUrl, name, shortName }).
 * - Fallback: Deterministic HSL monogram with initial letters calculated from team name.
 */

import { useState } from 'react';
import './Crest.css';

// Size presets mapping named string sizes (used previously by TeamBadge) to pixel values
const SIZE_PRESETS = {
  sm: 20,
  md: 30,
  lg: 42,
};

// Deterministic hue from name — same team/league/player always gets the same fallback background color.
export function nameToHue(name) {
  if (!name) return 200;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Crest({ team, logoUrl, crestUrl, name, size = 24 }) {
  const [failed, setFailed] = useState(false);

  // Resolve team object vs individual props for maximum compatibility across caller components
  const resolvedLogo = logoUrl ?? crestUrl ?? team?.logoUrl ?? team?.crestUrl;
  const resolvedName = name ?? team?.name ?? team?.shortName ?? 'Team';

  // Resolve size prop (supports numeric pixels or 'sm' / 'md' / 'lg' presets)
  const resolvedSize = typeof size === 'number' ? size : (SIZE_PRESETS[size] ?? 24);

  const showImage = resolvedLogo && !failed;

  if (showImage) {
    return (
      <img
        src={resolvedLogo}
        alt={`${resolvedName} crest`}
        className="crest crest--img"
        style={{ width: resolvedSize, height: resolvedSize }}
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
        width: resolvedSize,
        height: resolvedSize,
        backgroundColor: `hsl(${nameToHue(resolvedName)}, 45%, 40%)`,
        fontSize: resolvedSize * 0.4,
      }}
      aria-label={`${resolvedName} crest`}
    >
      {getInitials(resolvedName)}
    </div>
  );
}
