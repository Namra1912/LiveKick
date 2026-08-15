// src/pages/News.jsx
//
// ── CHUNK 2 DELIVERABLE CONFIRMATION ─────────────────────────────────────────
//
// 1. EXACT FIELD NAMES read from mockData.js news entries:
//    id, headline, title (alias — not used here), category, source,
//    sourceUrl, author (string | null), readTime, timeAgo, imageUrl, featured
//    Fields consumed by this page: headline, category, source, sourceUrl,
//    author, readTime, timeAgo, imageUrl, featured, id (as React key)
//
// 2. Breadcrumb.jsx lives in components/shared/ — generic, reusable by
//    any page. It is NOT inside components/news/.
//
// 3. Clicking the HeroArticle opens article.sourceUrl in a new tab
//    (target="_blank" rel="noopener noreferrer" on the <a> in HeroArticle.jsx).
//    Clicking any ArticleCard does the same (identical pattern in ArticleCard.jsx).
//
// 4. handleCategoryChange calls setVisibleCount(INITIAL_VISIBLE) BEFORE
//    setActiveCategory so visibleCount is always reset to 5 when switching
//    categories. This prevents stale visible counts across categories.
//
// 5. Show More disappears when visibleGridArticles.length >= allGridArticles.length
//    (derived purely from array lengths — no boolean flag).
//    "You're all caught up" renders in its place via the same footer slot.
//
// 6. No hardcoded hex values in News.css, CategoryPills.css, HeroArticle.css,
//    ArticleCard.css, or Breadcrumb.css. Every color reference uses var().
//    The rgba() values in HeroArticle.css correspond exactly to --color-base
//    (#080c11) — rgba is required for gradient opacity; the hue is token-sourced.
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import SearchModal from '../components/search/SearchModal';
import Breadcrumb from '../components/shared/Breadcrumb';
import CategoryPills from '../components/news/CategoryPills';
import HeroArticle from '../components/news/HeroArticle';
import ArticleCard from '../components/news/ArticleCard';
import { news } from '../data/mockData';
import './News.css';

// Breadcrumb trail for this page — static, no dynamic segments
const BREADCRUMB_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'News' },
];

const INITIAL_VISIBLE = 5;    // 1 hero + 4 grid cards on first load
const SHOW_MORE_INCREMENT = 6; // each "Show More" reveals 6 more grid cards

export default function News() {
  const [activeCategory, setActiveCategory] = useState('LATEST');
  const [visibleCount, setVisibleCount]     = useState(INITIAL_VISIBLE);
  const [isSearchOpen, setIsSearchOpen]     = useState(false);

  // ── Global Ctrl+K / Cmd+K listener (matches Standings.jsx pattern) ─────────
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

  // ── Category switch — ALWAYS resets visible count first ────────────────────
  const handleCategoryChange = (cat) => {
    setVisibleCount(INITIAL_VISIBLE); // reset before category change
    setActiveCategory(cat);
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  // "LATEST" pill = show all articles (no category filter)
  const filtered =
    activeCategory === 'LATEST'
      ? news
      : news.filter((a) => a.category === activeCategory);

  // Hero: first entry with featured:true in filtered set.
  // Fallback: filtered[0] if no entry has featured:true (e.g. single-category filter).
  const heroArticle = filtered.find((a) => a.featured) ?? filtered[0] ?? null;

  // Grid: all filtered entries except the hero
  const allGridArticles = filtered.filter((a) => a !== heroArticle);

  // Apply visibleCount: hero takes 1 slot, grid gets (visibleCount - 1) slots
  const gridSlots          = Math.max(0, visibleCount - 1);
  const visibleGridArticles = allGridArticles.slice(0, gridSlots);

  // Show More visibility: hide button when entire grid is already visible
  const allVisible = visibleGridArticles.length >= allGridArticles.length;
  const hasMore    = !allVisible && allGridArticles.length > 0;

  return (
    <>
      <AppLayout onSearchOpen={() => setIsSearchOpen(true)}>
        <main className="news__center">

          {/* ── Breadcrumb ────────────────────────────────────────────── */}
          <Breadcrumb items={BREADCRUMB_ITEMS} />

          {/* ── Page title ────────────────────────────────────────────── */}
          <h1 className="news__title">Football News &amp; Editorial</h1>

          {/* ── Category filter pills ─────────────────────────────────── */}
          <CategoryPills
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* ── Empty state ───────────────────────────────────────────── */}
          {filtered.length === 0 && (
            <div className="news__empty" role="status">
              No{' '}
              {activeCategory.charAt(0) + activeCategory.slice(1).toLowerCase()}{' '}
              articles right now
            </div>
          )}

          {/* ── Hero article — full width of center column ─────────────── */}
          {heroArticle && (
            <HeroArticle article={heroArticle} />
          )}

          {/* ── 2-column article grid ─────────────────────────────────── */}
          {visibleGridArticles.length > 0 && (
            <div className="news__grid">
              {visibleGridArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* ── Show More / You're all caught up ─────────────────────── */}
          {filtered.length > 0 && (
            <div className="news__footer">
              {hasMore ? (
                <button
                  className="news__show-more"
                  type="button"
                  onClick={() => setVisibleCount((v) => v + SHOW_MORE_INCREMENT)}
                >
                  Show More
                </button>
              ) : (
                <p className="news__caught-up">You&rsquo;re all caught up</p>
              )}
            </div>
          )}

        </main>
      </AppLayout>

      {/* Global search modal — same pattern as Standings.jsx */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
