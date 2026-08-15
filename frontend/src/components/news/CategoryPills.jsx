// src/components/news/CategoryPills.jsx
// Category filter pill row for the News page.
// Props:
//   activeCategory {string} — currently selected category
//   onCategoryChange {function} — called with the new category string on click
//
// "LATEST" = show all articles (no filter applied in News.jsx).
// Pills scroll horizontally on narrow viewports (overflow-x: auto).

import './CategoryPills.css';

const CATEGORIES = ['LATEST', 'RESULTS', 'TRANSFERS', 'INJURIES', 'RUMOURS'];

export default function CategoryPills({ activeCategory, onCategoryChange }) {
  return (
    <div
      className="category-pills"
      role="tablist"
      aria-label="Filter news by category"
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`category-pills__pill${isActive ? ' category-pills__pill--active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
