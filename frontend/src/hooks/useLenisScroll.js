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
 * @param {object}  [opts]
 * @param {number}  [opts.duration=1.0]
 * @param {number}  [opts.wheelMultiplier=1.0]
 * @param {boolean} [opts.smoothWheel=true]
 */
export function useLenisScroll(wrapperRef, opts = {}) {
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const {
      duration = 1.0,
      wheelMultiplier = 1.0,
      smoothWheel = true,
    } = opts;

    const lenis = new Lenis({
      wrapper: el,
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
  }, [wrapperRef, opts.duration, opts.wheelMultiplier, opts.smoothWheel]);
}
