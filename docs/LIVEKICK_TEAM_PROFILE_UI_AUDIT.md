# LiveKick — Team Profile: Full UI Audit (for tomorrow)

> Diagnosis only, no fixes yet. Organized by severity — real bugs first, then structural
> design problems, then polish-level issues. Compare against the FotMob reference
> screenshots from earlier in this conversation throughout.

---

## A. Real bugs, not just cosmetic (fix these regardless of UI direction)

1. **Fixture Difficulty shows Real Madrid twice.** The three "next 3 opponents" crests read
   `BET (H)`, `RMA (A)`, `RMA (A)` — same team appearing as two of the next three fixtures.
   This is a data/logic bug in whatever pulls the next-3-opponents list, not a display issue.
2. **Upcoming Fixtures list has the same duplicate.** Real Madrid appears twice, both listed
   as "Today · 21:00" — identical timestamps, which is itself a second red flag (two
   different matches can't both be the literal next match today). Likely the same root
   cause as #1 — worth fixing both from one investigation, not patching each list separately.
3. **Sticky right column behavior is unconfirmed, possibly not actually working.** Comparing
   scroll position across the screenshots, the right column *may* be behaving correctly
   (holds position while center scrolls past, then catches up near the bottom — which is
   normal, correct sticky-sidebar behavior when the two columns have different content
   heights) — but it's genuinely hard to tell from static screenshots alone whether
   `position: sticky` is actually applied, or whether both columns are just scrolling
   together in one shared container and it coincidentally looks similar for a stretch.
   **This needs to be checked directly in the code tomorrow, not guessed at from
   screenshots** — confirm whether `.right-column` (or equivalent) actually has
   `position: sticky` set, and whether any ancestor has an `overflow` value that would
   silently break the sticky context (a known way sticky positioning fails silently).
4. **Next Match card has an invented "VS" pill between the crests that doesn't exist in
   FotMob's reference at all** — FotMob shows just crest / plain time text / crest, no
   boxed element in between. Direct side-by-side comparison confirms this is pure invented
   decoration, not a stylistic choice.

## B. Structural design problems (root causes, not individual fixes)

> **Correction from an earlier draft of this doc:** boxes/cards per section are the
> **correct** pattern here, not the problem — FotMob uses exactly this pattern (Team Form,
> Next Match, League Table, Stadium Info all as separate boxes) and it looks clean. The
> Transfer Radar sidebar consolidation lesson does **not** apply here; that was a different
> problem (literal duplicate/overlapping filter controls in nested boxes). Do not merge
> sections together as the fix. The actual issue is execution quality within and around each
> box — inconsistent card styling, overused green hover/borders, and mismatched badge
> treatments — not the number of boxes.

5. **Every box currently has slightly different border/background/radius values because
   each component styled its own card independently**, rather than all of them sharing one
   card treatment. This is what makes a page full of legitimate, correctly-separated boxes
   still read as inconsistent — not the box count itself. Fix: one shared card
   component/class, consumed by every section, so all boxes share identical background tone,
   border color/weight, and radius — the same way FotMob's every box is visibly "the same
   kind of thing" despite showing different content.
6. **Color accents are overused and inconsistent.** The Starting XI pitch is a saturated
   neon green with glowing-outlined player circles and bright orange rating badges — FotMob's
   version uses a much darker, near-black-green pitch and plain grey player circles with
   small, restrained badges. Similarly, the League Table's highlighted Barcelona row uses a
   loud green gradient fill instead of a subtle background tint + thin accent border. Overall
   there are too many different accent treatments (orange goal badges, blue assist badges,
   green rating badges, green table highlight, green pitch, green pill buttons) competing
   for attention instead of one restrained, consistent accent language.
7. **The "#1" entries in Top Rated/Top Scorers/Top Assists get an isolated bright green box**
   while ranks 2-3 don't — this reads as an arbitrary, bolted-on "winner spotlight" rather
   than an intentional design choice, since nothing else on the page treats rank-1 specially
   this way.

## C. Content/data quality issues

8. **Team News images are still generic, unrelated stock photography** — a stadium exterior,
   a soccer ball on grass, a blurry crowd shot — none of it Barcelona-specific or even
   consistently football-relevant. This is the exact same unresolved problem flagged on the
   News page itself early in this project; it needs a real fix, and ideally the *same* fix
   should apply to both pages rather than solving it twice.
9. **Player avatars are still initials-only, no real photos**, and you're right that real
   photos would meaningfully improve how premium this looks. But — important — the last time
   "add real player photos" was attempted (Transfer Radar), an automated fetch returned
   generic football stock images instead of actual players, which looked worse than the
   placeholder it replaced. Whatever fix gets built for real photos needs to be a single,
   carefully-sourced solution (e.g. verified direct Wikimedia Commons image URLs, manually
   checked) reused across both Transfer Radar and Team Profile — not two separate attempts,
   and not another automated bulk fetch without verification.

10. **Team News grid cards have inconsistent image heights**, producing a ragged, uneven grid
   instead of clean aligned cards — needs a fixed aspect ratio or `object-fit: cover` applied
   consistently.
11. **Right column cards appear slightly more cramped (less internal padding) than center
    column cards** — worth an explicit pass to confirm both use the same spacing scale/tokens
    rather than drifting independently.

---

## Suggested approach for tomorrow

1. Fix section A bugs first (duplicate Real Madrid, confirm sticky behavior, remove the
   invented VS pill) — independent of any visual direction, do these regardless.
2. Build the one shared card component (item 5) and migrate every section to use it — the
   layout/box structure itself stays exactly as-is, only the shared styling changes.
3. Then apply the color/badge restraint rules (items 6, 7) on top of the now-consistent
   card foundation — see `LIVEKICK_DESIGN_RESTRAINT_PRINCIPLES.md` for the underlying rules
   this should follow.
4. Content quality issues (8, 9 — news images, player photos) as their own careful,
   deliberate pass, not bundled into the styling fix.
5. Spacing polish (10, 11) last — likely partially resolved already once 2-3 are done.
