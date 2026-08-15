// src/components/standings/LeagueSelector.jsx
//
// ══════════════════════════════════════════════════════════════
// DELIVERABLE AUDIT — Required answers (re-verified against live repo files)
// ══════════════════════════════════════════════════════════════
//
// 1. MOCKDATA.JS FIELD NAMES (verified lines 127–133):
//    - Slug field:        `slug`      Values: "pl" | "laliga" | "ucl" | "bundesliga" | "seriea"
//    - Display name:      `name`      Values: "Premier League" | "La Liga" | "Champions League" | "Bundesliga" | "Serie A"
//    - Logo URL:          `logoUrl`   (also has `matchday`, `country`, `id` — not used here)
//    Component maps over the real `leagues` array — no hardcoded list.
//
// 2. CREST PROP API (verified from Crest.jsx line 50):
//    `size` accepts numeric pixels (e.g. 20) OR named presets ('sm': 20, 'md': 30, 'lg': 42).
//    This component passes `size={20}` (numeric) — matches MatchRow.jsx usage and the
//    requested 20–24px range. `name` prop provides the fallback monogram text.
//    `logoUrl` prop feeds the league badge image. `aria-hidden` on the Crest img is
//    sufficient because the sibling text label already names the league.
//
// 3. PILL PATTERN — SOURCED FROM DateSelector.css + DELIBERATE DEVIATION:
//    SOURCED:
//      padding: 6px var(--space-4)  (6px top/bottom, 16px left/right)
//      border-radius: var(--radius-pill)
//      font-size: 12px
//      font-family: var(--font-body)
//      font-weight: 400 (rest) / 700 (active)
//      transition: all 0.15s
//    DEVIATION (documented):
//      DateSelector's pills share one enclosing `--surface` + `--border` track (the
//      `.date-selector__group` container). They are 1–2-word text-only segments in a
//      unified "segmented control" widget. LeagueSelector pills carry a crest + full
//      multi-word league name and are semantically independent navigation choices, not
//      segments of one compound control. Making them share a single track would render a
//      ~700px-wide opaque strip that breaks visual hierarchy. Design choice: each pill is
//      its own standalone button with its own `--surface` bg + `--border` hairline,
//      arranged in a flex gap row. Same padding/radius/font stack sourced from DateSelector.
//      Hover: bg shift to `--color-surface-hover` (matched from MatchRow.css line 111,
//      which uses the same token for row hover — more appropriate for standalone buttons
//      than DateSelector's text-color-only hover, which is tuned for short text segments
//      inside a containing vessel where bg differentiation isn't needed).
//
// 4. PITCH-GREEN AND HOVER TOKEN NAMES (verified from tokens.css):
//    Pitch-green accent: `--color-pitch-green` (#00B370)
//    Hover bg token:     `--color-surface-hover` (#18222d)
//
// 5. SETSEARCHPARAMS SEMANTICS:
//    This component calls `setSearchParams({ league: slug })` with NO `replace` option.
//    React Router's default for setSearchParams is PUSH — each deliberate user click
//    adds a navigable history entry. Chunk 2's initial default-fallback redirect uses
//    `{ replace: true }` and is UNTOUCHED — only Chunk 2's own useEffect calls replace.
//    Confirmed these are two separate call sites with different semantics, as required.
//
// 6. HORIZONTAL SCROLL + SCROLLBAR HIDING:
//    No horizontal-scroll-with-hidden-scrollbar precedent exists in this codebase.
//    The only overflow-x usage found is `overflow-x: hidden` in Sidebar.css (line 106),
//    which hides overflow entirely, not a scrollable row. Rather than invent new
//    scrollbar-hiding CSS (::-webkit-scrollbar / scrollbar-width: none) with no
//    established precedent, the native scrollbar is left visible on narrow viewports.
//    `overflow-x: auto` + `white-space: nowrap` on the row ensures pills never clip.
// ══════════════════════════════════════════════════════════════

import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Crest from '../shared/Crest';
import { leagues } from '../../data/mockData';
import './LeagueSelector.css';

// Build slug → league lookup once at module level — avoids per-render iteration.
// Sourced from the same mockData.js leagues array that Standings.jsx uses.
const LEAGUE_BY_SLUG = Object.fromEntries(leagues.map((l) => [l.slug, l]));
const DEFAULT_SLUG = leagues[2].slug; // "ucl"

export default function LeagueSelector() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Resolve active slug from URL — mirror Standings.jsx's contract exactly.
  // If param is missing/invalid, treat as default. No separate state needed.
  const rawSlug = searchParams.get('league');
  const activeSlug = rawSlug && LEAGUE_BY_SLUG[rawSlug] ? rawSlug : DEFAULT_SLUG;

  // PUSH semantics — each click is a navigable history entry.
  // Intentionally NOT { replace: true } (Chunk 2's fallback redirect uses replace).
  const handleSelect = useCallback(
    (slug) => {
      if (slug === activeSlug) return; // No-op on already-active pill
      setSearchParams({ league: slug }); // push (default)
    },
    [activeSlug, setSearchParams]
  );

  return (
    // role="group" scopes the semantics: "league selector" is one navigational group
    <div className="league-selector" role="group" aria-label="Select league">
      {leagues.map((league) => {
        const isActive = league.slug === activeSlug;
        return (
          <button
            key={league.slug}
            type="button"
            className={`league-selector__pill${isActive ? ' league-selector__pill--active' : ''}`}
            onClick={() => handleSelect(league.slug)}
            // aria-current="true" is the right semantic for "this is the currently
            // displayed view" in a nav/tab-like selector — not aria-pressed (which
            // describes a binary toggle). Using string "true" per ARIA spec.
            aria-current={isActive ? 'true' : undefined}
          >
            {/* Crest is decorative — the sibling text label is the accessible name */}
            <span className="league-selector__crest" aria-hidden="true">
              <Crest
                logoUrl={league.logoUrl}
                name={league.name}
                size={20}
              />
            </span>
            <span className="league-selector__label">{league.name}</span>
          </button>
        );
      })}
    </div>
  );
}
