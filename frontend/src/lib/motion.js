// src/lib/motion.js
// The ONE shared Framer Motion vocabulary for the whole app. Every page/component
// that animates imports from here instead of hand-rolling its own transition —
// this is what keeps motion consistent instead of a different curve per file.
//
// Reduced motion is handled once, globally, via <MotionConfig reducedMotion="user">
// in App.jsx — individual components never need their own prefers-reduced-motion check.
//
// Durations/easing mirror the CSS tokens in styles/tokens.css (--motion-fast/base/slow,
// --ease-out-strong) so JS-driven and CSS-driven motion never drift apart.

export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT_UI = [0.77, 0, 0.175, 1];

export const DURATION = {
  fast: 0.14,
  base: 0.22,
  slow: 0.32,
};

/** Page-level mount: subtle fade + rise. Use once per page root, never per-widget. */
export const pageIn = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT_STRONG },
  },
};

/** Wrap a list container with this + `listItem` on each child for a staggered entrance. */
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.035, delayChildren: 0.02 },
  },
};

/** Child variant for rows in a staggered list (match rows, transfer rows, news cards…). */
export const listItem = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_STRONG },
  },
};

/** Tab/panel content swap: quick fade, no direction bias. */
export const panelFade = {
  hidden: { opacity: 0, y: 4 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_STRONG },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASE_OUT_STRONG },
  },
};

/** Spread onto any pressable element (button, card, row) for hover/press feedback. */
export const pressable = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.98 },
  transition: { duration: DURATION.fast, ease: EASE_OUT_STRONG },
};

/** Slightly stronger press-only feedback for icon/pill buttons — no hover lift. */
export const tappable = {
  whileTap: { scale: 0.94 },
  transition: { duration: DURATION.fast, ease: EASE_OUT_STRONG },
};
