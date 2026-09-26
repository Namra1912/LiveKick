// src/pages/News.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import SearchModal from '../components/search/SearchModal';
import Breadcrumb from '../components/shared/Breadcrumb';
import CategoryPills from '../components/news/CategoryPills';
import ArticleCard from '../components/news/ArticleCard';
import { news } from '../data/mockData';
import { pageIn, listItem } from '../lib/motion';
import './News.css';

const BREADCRUMB_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'News' },
];

const INITIAL_VISIBLE = 4;
const SHOW_MORE_INCREMENT = 4;

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
        <motion.main
          className="news__center"
          initial="hidden"
          animate="show"
          variants={pageIn}
        >
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
              {visibleGridArticles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial="hidden"
                  animate="show"
                  variants={listItem}
                  transition={{ ...listItem.show.transition, delay: Math.min(i, 8) * 0.03 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
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
        </motion.main>

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
