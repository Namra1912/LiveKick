# LiveKick — Design Restraint Principles (FotMob-derived)

> Reference document, not a build prompt. Point future page-build prompts at this when UI
> quality is the concern, rather than re-deriving these principles each time.

## The core insight

FotMob's chrome is deliberately boring so real content — crests, player photos, competition
badges, actual numbers — can carry the page's visual interest. LiveKick's recurring UI
problem across pages isn't "too many boxes" or "wrong colors" individually — it's that the
UI chrome keeps competing with content for attention instead of receding to frame it.

## Five rules, derived directly from FotMob's actual execution

1. **Boxes/cards per section are correct and encouraged — FotMob is full of them and it
   still looks calm.** The goal is never "fewer boxes" or "consolidate sections together."
   The goal is **one shared card component, used everywhere, never redefined per section.**
   Every bordered container on a page (Team Form, Next Match, League Table, Stadium Info,
   any future widget) should consume the *same* base card class/component — same background
   tone, same border color/weight, same radius, same padding scale. A page can have a dozen
   boxes and look premium, as long as every box is visibly "the same kind of thing." If a
   new page's component file is defining its own card background/border/radius values
   instead of importing a shared one, that's the drift point to fix — not the box count.
2. **Color is reserved for one meaning at a time — never decorative.** Green means win/
   positive/active-brand-action (Follow button, W results, active tab). It should never
   simultaneously be a border color, a hover color, a background tint, AND a results color
   on the same page — pick the narrowest correct usage and stop there.
3. **Real content is the personality; UI chrome has none.** Crests, real photos, real
   competition badges are where visual interest should live. Pitch graphics, stat cards, and
   containers should stay flat, dark, and quiet enough that real assets are what draws the
   eye — not a saturated background or a glowing border competing with them.
4. **One badge/pill style, differentiated by label text, not by color.** If three different
   stats (rating, goals, assists) are displayed in a similar UI pattern, they should share
   one badge treatment — the column header or label text does the differentiating, not three
   different accent colors.
5. **Density comes from alignment discipline, not just small text.** Tight rows and compact
   tables should still align to a strict grid — consistent row height, right-aligned numeric
   columns, consistent header weight across every table on the site. This is what makes
   dense information feel organized rather than cluttered.

6. **No invented UI elements that don't exist in the reference.** Example found directly by
   comparing screenshots: LiveKick's Next Match card has a boxed "VS" pill between the two
   crests — FotMob has no such element at all, just crest / plain time text / crest. If
   FotMob doesn't have a box, badge, or decoration in a given spot, don't add one there
   either, even if it seems like a small, harmless addition.
7. **Starting XI avatar treatment must match FotMob's exact badge-overlay pattern, not a
   different structure.** FotMob: plain circle (photo fills it), a small rating pill
   *overlapping the top-right corner* of the circle, a tiny jersey-number badge overlapping
   the *bottom-left* corner, name below. No ring/border around the circle itself. LiveKick
   currently shows the jersey number as large, centered content inside a fully ring-outlined
   circle — this is a structurally different layout, not just a color mismatch. Fix this to
   match FotMob's exact overlay positions even before real photos exist — the circle's
   center content can stay as an initials-monogram placeholder, but the number/rating badge
   positions and the absence of a ring border should already match the target structure.
8. **Pitch background must be near-black green, not saturated/bright green** — check this
   specifically against the reference screenshot side by side, the difference is stark.

## How to apply this going forward

- Before building a new page's visual layer, check whether a shared card/badge component
  already exists in the codebase and reuse it — don't let each page reinvent its own card
  styling, even slightly.
- When a page "feels boxy/loud/AI-generated" despite matching a reasonable layout spec, the
  fix is almost never "remove boxes" — FotMob has plenty of boxes and still looks calm. The
  fix is checking these rules against what got built.
- This applies to every future page (Player Profile, Predictions League, Settings, etc.),
  not just Team Profile — treat it as a standing quality bar, not a one-off correction.
- **When in doubt about whether a decorative element earns its place, ask "why does this
  exist?"** (Emil Kowalski's design-engineering framework). A ring border around an avatar,
  a boxed "VS" pill, a glow effect — if the honest answer is "it looked like it needed
  something there" rather than a specific functional reason (state indication, feedback,
  spatial consistency), cut it. Decoration without a stated purpose is exactly what makes an
  interface read as generated rather than designed.
- **Any hover/motion added during this fix should follow strict restraint**: nothing under
  300ms feels sluggish, and nothing should animate "because it's there" — every transition
  needs an answer to "why does this move," same bar as every color/border decision above.
- If Antigravity's environment has the `impeccable` design skill available, this exact
  situation — an overstimulating design that needs toning down while preserving its
  structure — is precisely what its `quieter` command is built for. Its own internal
  principle for app/dashboard UI ("Operate mode": scanability, consistency, and native
  expectations outrank expression; brand lives in precise details, not decoration) reaches
  the same conclusion this document does independently — worth invoking directly if
  available rather than re-deriving it from scratch.

- Before building a new page's visual layer, check whether a shared card/badge component
  already exists in the codebase and reuse it — don't let each page reinvent its own card
  styling, even slightly.
- When a page "feels boxy/loud/AI-generated" despite matching a reasonable layout spec, the
  fix is almost never "remove boxes" — FotMob has plenty of boxes and still looks calm. The
  fix is checking these five rules against what got built.
- This applies to every future page (Player Profile, Predictions League, Settings, etc.),
  not just Team Profile — treat it as a standing quality bar, not a one-off correction.
