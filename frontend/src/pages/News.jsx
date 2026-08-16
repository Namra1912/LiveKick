// src/pages/News.jsx

import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import SearchModal from '../components/search/SearchModal';
import Breadcrumb from '../components/shared/Breadcrumb';
import CategoryPills from '../components/news/CategoryPills';
import ArticleCard from '../components/news/ArticleCard';
import { news } from '../data/mockData';
import './News.css';

const BREADCRUMB_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'News' },
];

const INITIAL_VISIBLE = 6;
const SHOW_MORE_INCREMENT = 6;

export default function News() {
  const [activeCategory, setActiveCategory] = useState('LATEST');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const handleCategoryChange = (cat) => {
    setVisibleCount(INITIAL_VISIBLE);
    setActiveCategory(cat);
  };

  const filtered =
    activeCategory === 'LATEST'
      ? news
      : news.filter((a) => a.category === activeCategory);

  const visibleGridArticles = filtered.slice(0, visibleCount);
  const allVisible = visibleGridArticles.length >= filtered.length;
  const hasMore = !allVisible && filtered.length > 0;

  return (
    <>
      <AppLayout onSearchOpen={() => setIsSearchOpen(true)}>
        <main className="news__center">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
          <h1 className="news__title">Football News &amp; Editorial</h1>
          <CategoryPills
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {filtered.length === 0 && (
            <div className="news__empty" role="status">
              No {activeCategory.charAt(0) + activeCategory.slice(1).toLowerCase()} articles right now
            </div>
          )}

          {visibleGridArticles.length > 0 && (
            <div className="news__grid">
              {visibleGridArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

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

        {/* Zero-width aside — satisfies AppLayout flex structure without adding visual content */}
        <aside className="news__right-spacer" aria-hidden="true" />
      </AppLayout>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
