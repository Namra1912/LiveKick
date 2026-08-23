/**
 * useLenisScroll.js — Reusable element-scoped smooth-scroll hook (Lenis 1.x)
 *
 * APPLIED TO EXACTLY THREE CONTAINERS (none is window or document):
 *   1. .sidebar__scroll   — Sidebar.jsx          — the team/league list pane
 *   2. .home-feed__center — HomeFeed.jsx / CenterFeed — the main match feed column
 *   3. .home-feed__right  — HomeFeed.jsx / RightPanel  — the right panel (MOTD, Predictor, News)
 *
 * NEVER attached to window or document.
 * Each of the three containers has its own independent Lenis instance.
 * Each instance is destroyed on component unmount to prevent dangling listeners.
 *
 * Lenis API (v1.x):
 *   wrapper  — the overflow-y:auto element the user scrolls (the viewport pane)
 *   content  — the inner growing element; defaults to wrapper.firstElementChild
 *   duration — 1.0 s (slightly snappier than Lenis default 1.2 for dense data UIs)
 *   easing   — exponential ease-out: fast start, clean deceleration, no float
 */

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * @param {React.RefObject<HTMLElement>} wrapperRef
 *   Ref to the scrollable container element (the one with overflow-y: auto).
 * @param {React.RefObject<HTMLElement>|object} [contentRefOrOpts]
 *   Ref to the content element that actually grows/shrinks in size, OR options object.
 * @param {object} [opts]
 *   Options if contentRef is passed as 2nd arg.
 */
export function useLenisScroll(wrapperRef, contentRefOrOpts, opts = {}) {
  let contentRef = null;
  let options = opts;

  if (contentRefOrOpts && (contentRefOrOpts.current !== undefined || contentRefOrOpts instanceof HTMLElement)) {
    contentRef = contentRefOrOpts;
  } else if (contentRefOrOpts && typeof contentRefOrOpts === 'object') {
    options = contentRefOrOpts;
    contentRef = options.contentRef || null;
  }

  const {
    duration = 1.0,
    wheelMultiplier = 1.0,
    smoothWheel = true,
  } = options;

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Pass the actual growing/shrinking child container to Lenis content option
    // so Lenis's ResizeObserver correctly detects content height changes
    const contentEl =
      contentRef?.current ||
      (contentRef instanceof HTMLElement ? contentRef : null) ||
      el.firstElementChild ||
      undefined;

    const lenis = new Lenis({
      wrapper: el,
      content: contentEl,
      duration,
      wheelMultiplier,
      smoothWheel,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperRef, contentRef, options.duration, options.wheelMultiplier, options.smoothWheel]);
}
