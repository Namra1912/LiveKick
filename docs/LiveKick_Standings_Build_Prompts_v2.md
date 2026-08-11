# LiveKick — Standings Page: Chunk-by-Chunk Build Prompts (v2)

Feed these to Antigravity **one at a time, in order**. Review and merge each chunk before sending the next — do not batch multiple chunks into one prompt, even if Antigravity offers to.

Locked decisions (do not let any prompt drift from these):
- **Champions League** = real Swiss-league single table, 36 teams, no groups.
- **Zone indicator** = thin colored strip on the **RIGHT edge** of each table row (FotMob-style). NOT a left border — that's already reserved for favorited-match styling elsewhere in the app, and reusing it here would make two unrelated things look identical.
- **Mock data is populated in full BEFORE any UI work** (this is Chunk 1). No disabled pills, no "..." gap rows, no partial tables anywhere in the final build.

---

## PASTE THIS BLOCK AT THE TOP OF EVERY CHUNK PROMPT BELOW

```
DESIGN SYSTEM — NIGHT-PITCH — READ BEFORE WRITING ANY CODE:

Before writing a single line, open frontend/src/styles/tokens.css and 
.agents/AGENTS.md and list out (in your own working notes) the exact 
variable names for: background layers, text colors, pitch-green accent, 
live-red, border/hairline color, the three radius tiers, and the two 
shadow tokens (inset + card). Use ONLY those exact variable names. If a 
color or spacing value you need doesn't exist as a token, stop and flag 
it in your deliverable comment instead of inventing a new hex value or a 
new CSS variable. Do not guess variable names from memory or from other 
LiveKick docs — verify them by actually reading the file.

TYPOGRAPHY — non-negotiable per component type:
- Big Shoulders Display (uppercase, tight tracking): scores, section 
  headings, page titles ONLY. Never body text, never table cell values.
- Inter: all body text, labels, team/player names, descriptive copy.
- JetBrains Mono: every number without exception — stats, points, goal 
  difference, timers, played/won/drawn/lost counts, goal/assist totals. 
  If it's a digit a user might scan quickly, it's mono.

ANTI-AI-SLOP — explicitly BANNED, do not produce any of these:
- Generic centered "icon-above-label-above-number" stat block cards.
- Soft pastel or gradient-fill status colors ("gentle" greens/reds) — 
  status colors are flat and confident, exactly the tokens.css hex values, 
  no opacity fades, no gradient overlays on solid color fills.
- Purple/blue AI-gradient backgrounds or accents anywhere.
- Pure black (#000, except the retro scoreboard digit cells elsewhere in 
  the app — not relevant to Standings) or pure white text.
- Oversized border-radius on anything (cards/pills/badges must match the 
  existing --radius-card / --radius-pill / --radius-badge tiers exactly — 
  no custom in-between radius values).
- Airy, over-padded "admin dashboard" spacing. This is a fast-scanning 
  sports data table, not a SaaS settings page — rows should be dense and 
  confident, matching the row height and internal padding used in 
  MatchRow.jsx/.css as the reference for "how tight is too tight."
- Generic hover states (scale-transform + shadow bloom). Match the hover 
  treatment already used on MatchRow/LeagueGroup instead (check their CSS 
  first) — likely a background-color shift to --hover token, not a scale 
  or shadow change.
- Decorative icons with no functional purpose. Every glyph on this page 
  must communicate something (zone strip, form result, sort direction) — 
  no filler iconography.
- Drop shadows that aren't the existing --shadow-card / --shadow-inset 
  pair. No new shadow values.

Every hover/transition must respect prefers-reduced-motion, matching the 
pattern already used elsewhere in the app.
```

---

## CHUNK 1 — Mock Data Foundation

```
[PASTE THE SHARED BLOCK ABOVE FIRST]

Update frontend/src/data/mockData.js only. Do not touch any component or 
page files in this chunk.

GOAL: make `standings` complete and internally consistent for all 5 
leagues, and add two new exports: `topScorers` and `topAssists`. This 
chunk is data-only — nothing renders yet, so there is no visual/anti-slop 
work here, but the schema must be clean enough that later UI chunks don't 
need workarounds.

REQUIREMENTS:
1. `standings` must have full tables for all 5 leagues, keyed exactly as 
   they are now: "Premier League", "La Liga", "Champions League", 
   "Bundesliga", "Serie A".
   - Premier League: 20 teams
   - La Liga: 20 teams
   - Bundesliga: 18 teams
   - Serie A: 20 teams
   - Champions League: 36 teams, Swiss-league single-table format (no 
     groups, no "..." gap rows — every position 1-36 is a real row)
2. Each row needs: pos, a team reference matching the EXACT shape/field 
   name already used elsewhere in mockData.js for referencing a team 
   (check how MatchRow/mockData currently reference teams — do not invent 
   a new reference shape like teamSlug if the codebase already uses 
   teamId or similar), played, w, d, l, gf, ga, gd, pts, form (array of 
   last 5 results, "W"/"D"/"L", most recent last).
3. Stats must be internally consistent: pts = w*3 + d, gd = gf - ga, and 
   rows sorted by pts desc, then gd desc, then gf desc, with pos matching 
   that sorted order exactly — no manual/random position numbers.
4. Reuse existing `teams` array entries wherever a club already exists 
   there (for crest lookup via existing logoUrl). Only add new team 
   objects for clubs not already present — new entries must match the 
   exact shape of existing team objects, including a working logoUrl 
   (TheSportsDB or equivalent, consistent with how current teams source 
   theirs).
5. Add `export const topScorers` and `export const topAssists`, both 
   objects keyed by the same 5 league names, each holding an array of 5 
   players: { name, [team reference field], goals } / { ..., assists }. 
   Player names can be plausible/invented — this is mock data.
6. Do not rename or restructure any existing field on `standings`, 
   `teams`, or `leagues` — only extend.

DELIVERABLE: In a comment block at the top of the changed section of 
mockData.js, list which teams were newly added (vs reused) per league, 
and confirm the Champions League table has exactly 36 rows with no gaps.
```

---

## CHUNK 2 — Page Shell + URL State

```
[PASTE THE SHARED BLOCK ABOVE FIRST]

Build ONLY the skeleton of the Standings page — routing and state, no 
visual design work yet. This chunk exists to prove the URL/state 
contract works before anything is styled.

FILES:
- Replace stub content in frontend/src/pages/Standings.jsx (keep the 
  <AppLayout> wrapper).
- Create frontend/src/pages/Standings.css (new file — stop referencing 
  StubPage.css on this page; check no other page depends on it before 
  leaving/removing it).

REQUIREMENTS:
1. Import `useSearchParams` from react-router-dom, read a `league` query 
   param.
2. Valid values are the 5 real league slugs from mockData.js `leagues` 
   (check the actual field name and values there — do not assume `pl`/
   `laliga`/etc. without confirming against the real data). If missing or 
   invalid, default to Premier League's slug and update the URL via 
   setSearchParams with `replace: true` (no extra history entry).
3. Store the resolved active league as the full league object (not just 
   the slug) in local state, derived from the URL param.
4. Render a plain-text placeholder inside AppLayout's content area 
   showing the active league's name — no crest, no table, no pills yet. 
   Style minimally using tokens.css variables only (background layer, 
   text-primary).
5. Set up the page's outer CSS grid in Standings.css to match Home Feed's 
   structure: center column + right column, same max-width/gutter 
   conventions as HomeFeed.css, so later chunks slot in without a layout 
   rewrite. Right column can be an empty placeholder div for now.

DELIVERABLE: Confirm in a code comment which exact field name/values you 
used for the league slug, sourced from the real mockData.js leagues 
array (not assumed).
```

---

## CHUNK 3 — League Pill Row Selector

```
[PASTE THE SHARED BLOCK ABOVE FIRST]

Add the league selector pill row. All 5 leagues are fully selectable — 
Chunk 1 already gave every league complete data, so there is no disabled 
state on this page at all.

FILES:
- New: frontend/src/components/standings/LeagueSelector.jsx + 
  LeagueSelector.css
- Wire into Standings.jsx from Chunk 2.

REQUIREMENTS:
1. One pill per league from mockData.js `leagues` (5 total), each showing 
   the shared <Crest> component (size ~20-24px) + league name in Inter.
2. Reference DateSelector.jsx/.css for the existing pill pattern in this 
   codebase before writing new pill CSS — match its padding/height 
   proportions and interaction pattern rather than designing a new pill 
   style from scratch. Use --radius-pill.
3. Active state: distinct but restrained — background shift to 
   --elevated plus a slim bottom border in the pitch-green token (check 
   its real variable name). Do NOT fill the active pill with a heavy 
   solid green background, and do NOT use gold — gold is reserved 
   exclusively for Matchday Coins currency elsewhere in the app.
4. Inactive pills: --surface background, --text-secondary text. Hover: 
   background shift to --hover token only (see the banned generic-hover 
   list in the shared block above).
5. Clicking a pill updates the `league` query param via setSearchParams 
   (push, not replace, so back/forward navigation between leagues works) 
   without a full page reload or scroll-position loss.
6. Horizontal scroll (not wrap) on narrow viewports if 5 pills don't fit 
   — never let a pill become unreachable.

DELIVERABLE: Confirm which existing pill pattern (DateSelector or other) 
was used as the styling reference.
```

---

## CHUNK 4 — Main Standings Table

```
[PASTE THE SHARED BLOCK ABOVE FIRST]

Build the core standings table, driven by the active league from Chunk 
3's selector. Full data exists for all 5 leagues (Chunk 1), so this table 
must render correctly for every league including the 36-row Champions 
League table with no special-casing or gap rows.

FILES:
- New: frontend/src/components/standings/StandingsTable.jsx, 
  StandingsRow.jsx (+ matching .css files)
- Wire into Standings.jsx, replacing the Chunk 2 placeholder.

REQUIREMENTS:
1. Columns: POS, CLUB, P, W, D, L, GD, PTS, FORM. Column header row uses 
   Inter, small caps or uppercase via CSS, --text-secondary color, NOT 
   Big Shoulders Display (that's reserved for scores/page headings, not 
   table headers).
2. CLUB column: shared <Crest> (size ~24px) + team name in Inter, 
   --text-primary. Every other numeric column (P/W/D/L/GD/PTS) in 
   JetBrains Mono, right-aligned, no exceptions.
3. Row density: match MatchRow.jsx/.css's row height and internal 
   padding as the reference point — this must feel like a fast-scanning 
   data table, not a padded admin list. Check MatchRow's actual CSS 
   values before picking numbers.
4. FORM column: 5 small badges (--radius-badge), most recent result on 
   the right. W = pitch-green token (flat fill, no gradient/opacity 
   fade), D = the existing neutral/secondary token (check tokens.css — 
   do not invent a new gray), L = live-red token. Text inside each badge 
   (W/D/L letter) uses whichever text color already passes contrast 
   against that fill elsewhere in the app (check how status colors pair 
   with text elsewhere, e.g. status badges in MatchRow).
5. Zone indicator: a thin (2-3px) colored strip on the RIGHT edge of each 
   row — not a left border, not a badge, not a background tint on the 
   whole row. Ranges:
   - PL / La Liga / Serie A / La Liga-style domestic leagues (4 of the 5): 
     positions 1-4 = Champions League strip (pitch-green token), position 
     5 = Europa League strip (a distinct existing token — check tokens.css 
     for anything already used for "secondary" or "warning" status before 
     adding one; flag in deliverable if none exists and you had to pick 
     the closest safe fallback), position 6 = Conference League strip 
     (another distinct existing token, same rule), bottom 3 positions = 
     relegation strip (live-red token).
   - Bundesliga specifically: same as above, but position 16 gets its own 
     "relegation playoff" strip color (distinct from both Conference and 
     full relegation) if a 4th distinct existing token can be found; 
     otherwise fold it into the relegation strip and note that in the 
     deliverable comment.
   - Champions League (36-team Swiss table): top 8 = "auto-qualify" strip 
     (pitch-green), positions 9-24 = "playoff round" strip (distinct 
     token, same rule as above), 25-36 = no strip (eliminated, strip 
     column present but transparent/empty — don't remove the column, 
     just leave it unfilled so table width stays consistent across 
     leagues).
6. Table wrapped in the existing double-bezel card treatment: outer rim 
   border + --shadow-inset + --shadow-card, --radius-card on the 
   container corners only (not on individual rows).
7. Responsive: check how MatchRow/LeagueGroup already handle narrow 
   viewports (horizontal scroll vs column hiding) and match that pattern 
   rather than introducing a new responsive strategy for this table.

DELIVERABLE: List which existing tokens.css color was used for each zone 
strip (UCL/Europa/Conference/relegation/playoff), and flag explicitly any 
case where no distinct existing token was available and a fallback was 
used instead.
```

---

## CHUNK 5 — League Identity Strip

```
[PASTE THE SHARED BLOCK ABOVE FIRST]

Add a compact league header strip above the pill row (or between pill row 
and table — your call based on what reads better once Chunk 3/4 are in 
place, but default to above the table, below the pills, if unsure).

FILES:
- New: frontend/src/components/standings/LeagueHeaderStrip.jsx + .css
- Wire into Standings.jsx.

REQUIREMENTS:
1. Shows the active league's crest (shared <Crest>, size ~32-40px) and 
   full official name in Inter, --text-primary.
2. If a `country`/region field doesn't already exist on league objects in 
   mockData.js, you may add one ONLY to the 5 existing league entries 
   (e.g. "England", "Spain", "Europe" for Champions League) — no other 
   changes to that data structure. If you add it, note this in the 
   deliverable comment.
3. Deliberately neutral: --surface or --elevated background, hairline 
   border matching existing card borders. Explicitly NO gold, NO heavy 
   green fill or glow — this strip is informational, not promotional, 
   and must not visually compete with live-match indicators or Matchday 
   Coins styling used elsewhere in the app.
4. Compact — single row height, proportioned like a slim card header, not 
   a hero banner. Check spacing against LeagueHeaderStrip's neighbors 
   (pill row, table) so vertical rhythm feels intentional, not stacked 
   arbitrarily.

DELIVERABLE: Confirm whether a `country` field was added to league mock 
data, and if so, list the values used per league.
```

---

## Still queued (send after 1-5 above are merged and reviewed)
- **Chunk 6 — Right Panel (Top Scorers / Top Assists):** deferred, out of 
  scope until the core table above is confirmed working end-to-end.
- **Chunk 7 — ⌘K Search Modal handoff to /standings?league=X:** deferred 
  until Chunk 2's URL contract has been live-tested with Chunks 3-5 
  actually driving it.

Don't send these two until you've reviewed 1-5 in the running app.
