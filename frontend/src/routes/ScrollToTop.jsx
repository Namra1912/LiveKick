// src/routes/ScrollToTop.jsx
// Resets scroll to the top on every route change (new match, new team, new
// player, etc.) so navigating never lands mid-page with the previous
// page's scroll position carried over. In-page interactions (tab switches,
// accordions) don't touch the URL path, so they're unaffected.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // The app shell never scrolls the document — AppLayout renders the
    // current page as the sole scrollable child of .app-layout__content
    // (see AppLayout.css: "each child scrolls itself"), so that's the node
    // that actually needs resetting on navigation, not window.
    window.scrollTo(0, 0);
    const scrollable = document.querySelector('.app-layout__content')?.firstElementChild;
    if (scrollable) scrollable.scrollTop = 0;
  }, [pathname]);

  return null;
}
