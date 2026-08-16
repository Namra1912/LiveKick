// src/components/news/CategoryPills.jsx
// Category filter pill row for the News page.
// Matches LeagueSelector.jsx pattern 1:1
// Props:
//   activeCategory {string} — currently selected category
//   onCategoryChange {function} — called with the new category string on click
//
// "LATEST" = show all articles (no filter applied in News.jsx).

import './CategoryPills.css';

const CATEGORIES = ['LATEST', 'RESULTS', 'TRANSFERS', 'INJURIES', 'RUMOURS'];

export default function CategoryPills({ activeCategory, onCategoryChange }) {
  return (
    <div
      className="category-pills"
      role="group"
      aria-label="Filter news by category"
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            className={`category-pills__pill${isActive ? ' category-pills__pill--active' : ''}`}
            onClick={() => onCategoryChange(cat)}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="category-pills__label">{cat}</span>
          </button>
        );
      })}
    </div>
  );
}
