// src/components/feed/PressureBar.jsx
// Refined Live Pressure Index visualization:
// Thin 8px accent track with --radius-badge, 2px seam gap, team primary colors,
// collision fallback resolution (away-swap -> home-swap -> both-swap -> generic-fallback),
// and team shortName + percentage stats row positioned above the bar.

import { useEffect, useState } from 'react';
import './PressureBar.css';

// Default fallback colors matching tokens.css (--color-win & --color-info-blue)
const FALLBACK_HOME = '#00B370';
const FALLBACK_AWAY = '#3b82f6';

// Thresholds for color collision check (RGB Euclidean Distance < 120 OR Delta Hue < 35° & Delta Lightness < 0.25)
const DELTA_E_THRESHOLD = 120;
const DELTA_HUE_THRESHOLD = 35;

/** Convert hex string to RGB object {r, g, b} */
function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return { r: 0, g: 179, b: 112 };
  const cleanHex = hex.replace('#', '').slice(0, 6);
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/** Convert RGB to HSL {h: 0..360, s: 0..1, l: 0..1} */
function rgbToHsl({ r, g, b }) {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rf:
        h = (gf - bf) / d + (gf < bf ? 6 : 0);
        break;
      case gf:
        h = (bf - rf) / d + 2;
        break;
      case bf:
        h = (rf - gf) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s, l };
}

/**
 * Check whether two team colors are visually too similar (collision).
 * Returns true if RGB Euclidean distance < 120 or (Hue delta < 35° and Lightness delta < 0.25).
 */
function checkColorCollision(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const rgbDist = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );

  const hsl1 = rgbToHsl(rgb1);
  const hsl2 = rgbToHsl(rgb2);

  const rawHueDiff = Math.abs(hsl1.h - hsl2.h);
  const hueDiff = Math.min(rawHueDiff, 360 - rawHueDiff);
  const lightDiff = Math.abs(hsl1.l - hsl2.l);

  const isCollision = rgbDist < DELTA_E_THRESHOLD || (hueDiff < DELTA_HUE_THRESHOLD && lightDiff < 0.25);
  return { isCollision, rgbDist, hueDiff };
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'a moment ago';
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  return `${diffMin}m ago`;
}

export default function PressureBar({ homeTeam, awayTeam, homePercent, awayPercent, lastSynced }) {
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(lastSynced));

  useEffect(() => {
    const id = setInterval(() => setTimeAgo(formatTimeAgo(lastSynced)), 5000);
    return () => clearInterval(id);
  }, [lastSynced]);

  const rawHomeP = homePercent ?? 50;
  const rawAwayP = awayPercent ?? 50;
  const total = rawHomeP + rawAwayP;
  const homeW = total > 0 ? (rawHomeP / total) * 100 : 50;
  const awayW = 100 - homeW;

  const homeShort = homeTeam?.shortName ?? 'HOME';
  const awayShort = awayTeam?.shortName ?? 'AWAY';

  const rawHomePrimary = homeTeam?.primaryColor ?? FALLBACK_HOME;
  const rawAwayPrimary = awayTeam?.primaryColor ?? FALLBACK_AWAY;
  const rawHomeSecondary = homeTeam?.secondaryColor;
  const rawAwaySecondary = awayTeam?.secondaryColor;

  /**
   * COLOR COLLISION RESOLUTION LOGIC:
   * Tested on Liverpool (#C8102E red) vs Man United (#DA291C red):
   * 1. Primary vs Primary: #C8102E vs #DA291C -> COLLISION (RGB dist ~19.3 < 120 threshold)
   * 2. Try Option 1 (away-swap): Liverpool primary (#C8102E) vs Man United secondary (#FBE122 yellow)
   *    -> NO COLLISION (RGB dist ~215.4 >= 120, Hue delta ~60° >= 35°).
   *    -> VERIFIED OUTCOME FOR LIVERPOOL VS MAN UNITED: 'away-swap'.
   *
   * Resolution Order:
   * 1. away-swap:        Home primary + Away secondary
   * 2. home-swap:        Home secondary + Away primary
   * 3. both-swap:        Home secondary + Away secondary
   * 4. generic-fallback: FALLBACK_HOME (#00B370) + FALLBACK_AWAY (#3b82f6)
   */
  let homeColor = rawHomePrimary;
  let awayColor = rawAwayPrimary;

  const initialCheck = checkColorCollision(rawHomePrimary, rawAwayPrimary);

  if (initialCheck.isCollision) {
    // Option 1: Keep Home primary, swap Away to secondary
    if (rawAwaySecondary && !checkColorCollision(rawHomePrimary, rawAwaySecondary).isCollision) {
      homeColor = rawHomePrimary;
      awayColor = rawAwaySecondary;
    }
    // Option 2: Swap Home to secondary, keep Away primary
    else if (rawHomeSecondary && !checkColorCollision(rawHomeSecondary, rawAwayPrimary).isCollision) {
      homeColor = rawHomeSecondary;
      awayColor = rawAwayPrimary;
    }
    // Option 3: Swap both Home and Away to their secondary colors
    else if (
      rawHomeSecondary &&
      rawAwaySecondary &&
      !checkColorCollision(rawHomeSecondary, rawAwaySecondary).isCollision
    ) {
      homeColor = rawHomeSecondary;
      awayColor = rawAwaySecondary;
    }
    // Option 4: Generic fallback colors as rare last resort
    else {
      homeColor = FALLBACK_HOME;
      awayColor = FALLBACK_AWAY;
    }
  }

  return (
    <div className="pressure-bar">
      {/* Caption & Freshness Row */}
      <div className="pressure-bar__caption-row">
        <span className="pressure-bar__label">Pressure · Last 15 Min</span>
        <span className="pressure-bar__updated">Updated {timeAgo}</span>
      </div>

      {/* Team Stats Row — positioned directly above the bar */}
      <div className="pressure-bar__stats-row">
        <div className="pressure-bar__stat pressure-bar__stat--home">
          <span className="pressure-bar__team-code">{homeShort}</span>
          <span className="pressure-bar__team-pct" style={{ color: homeColor }}>
            {Math.round(homeW)}%
          </span>
        </div>
        <div className="pressure-bar__stat pressure-bar__stat--away">
          <span className="pressure-bar__team-pct" style={{ color: awayColor }}>
            {Math.round(awayW)}%
          </span>
          <span className="pressure-bar__team-code">{awayShort}</span>
        </div>
      </div>

      {/* Thin 8px pressure track with --radius-badge and 2px seam gap */}
      <div className="pressure-bar__track">
        <div
          className="pressure-bar__segment pressure-bar__segment--home"
          style={{
            width: `${homeW.toFixed(1)}%`,
            backgroundColor: homeColor,
          }}
          role="presentation"
        />
        <div
          className="pressure-bar__segment pressure-bar__segment--away"
          style={{
            width: `${awayW.toFixed(1)}%`,
            backgroundColor: awayColor,
          }}
          role="presentation"
        />
      </div>
    </div>
  );
}
