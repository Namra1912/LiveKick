// src/pages/Standings.jsx
//
// ── DESIGN SYSTEM AUDIT (tokens.css + .agents/AGENTS.md read before writing) ──
// Background tokens used: --color-base, --color-surface
// Text tokens used:       --color-primary, --color-secondary, --color-faint
// No hardcoded hex values. All references are token var() calls via Standings.css.
//
// ── SLUG CONTRACT — sourced directly from mockData.js leagues array ──────────
// The `leagues` export has a `slug` field (verified at line 127–133).
// Exact slug values in data-order:
//   { slug: "pl",          name: "Premier League"  }  ← DEFAULT (first in array)
//   { slug: "laliga",      name: "La Liga"          }
//   { slug: "ucl",         name: "Champions League" }
//   { slug: "bundesliga",  name: "Bundesliga"       }
//   { slug: "seriea",      name: "Serie A"          }
//
// Validation set is built from the real data at module load — not hard-coded.
// If the ?league param is missing or doesn't match any slug, the page defaults
// to "pl" and replaces the URL (no extra history entry).
//
// StubPage.css intentionally NOT imported here — Standings now has its own CSS.
// StubPage.css is preserved for the remaining stub pages that still use it:
//   MatchDetail, TeamDetail, Transfers, PredictionsLeague, TacticsLab, News, Settings.
//
// ── CHUNK 4 CHANGES ──────────────────────────────────────────────────────────
// - Imported StandingsTable component.
// - Mounted <StandingsTable league={activeLeague} /> below <LeagueSelector />.
// - Consumes `activeLeague` directly — zero parallel league state introduced.

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import LeagueSelector from '../components/standings/LeagueSelector';
import StandingsTable from '../components/standings/StandingsTable';
import SearchModal from '../components/search/SearchModal';
import TopScorersCard from '../components/standings/TopScorersCard';
import TopAssistsCard from '../components/standings/TopAssistsCard';
import { leagues } from '../data/mockData';
import './Standings.css';

// Build the valid-slug → league-object lookup once at module level.
// This is the single source of truth — derived directly from mockData leagues.
const LEAGUE_BY_SLUG = Object.fromEntries(leagues.map((l) => [l.slug, l]));
const DEFAULT_SLUG = leagues[0].slug; // "pl" — Premier League (first in array)

export default function Standings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // If the URL param was missing or invalid, replace the URL with the default.
  const rawSlug = searchParams.get('league');
  const resolvedSlug = rawSlug && LEAGUE_BY_SLUG[rawSlug] ? rawSlug : DEFAULT_SLUG;

  useEffect(() => {
    if (resolvedSlug !== rawSlug) {
      setSearchParams({ league: resolvedSlug }, { replace: true });
    }
  }, [resolvedSlug, rawSlug, setSearchParams]);

  // Derive active league object directly from resolved slug
  const activeLeague = useMemo(
    () => LEAGUE_BY_SLUG[resolvedSlug],
    [resolvedSlug]
  );

  // Global ⌘K search shortcut listener
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <AppLayout onSearchOpen={() => setIsSearchOpen(true)}>
        {/* ── Center column ──────────────────────────────────────── */}
        <main className="standings__center">

          {/* League selector pill row — drives ?league URL param */}
          <LeagueSelector />

          {/* Core Standings Table — renders active league standings */}
          <StandingsTable league={activeLeague} />

        </main>

        {/* ── Right column ───────────────────────────────────────── */}
        {/* Top Scorers & Top Assists cards — stacked vertically */}
        <aside className="standings__right" aria-label="League statistics panel">
          <TopScorersCard league={activeLeague} />
          <TopAssistsCard league={activeLeague} />
        </aside>
      </AppLayout>

      {/* Global search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}


