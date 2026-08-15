// src/components/news/ArticleCard.jsx
// Grid article card for the News page.
//
// Props:
//   article {object} — a single news entry from mockData.js
//   Fields used: headline, category, source, sourceUrl, timeAgo, imageUrl
//
// Design:
//   - Double-bezel card treatment (border + --shadow-inset + --shadow-card)
//   - 16:9 image, top corners --radius-card, bottom corners 0
//   - Card body: category label + headline (2-line clamp) + footer
//   - Category: flat colored text via --color-category-* tokens (no chip)
//   - Headline: Inter, --color-primary, medium weight
//   - Footer: source name · timeAgo, Inter small
//   - Hover: background shifts to --color-surface-hover (no scale, no shadow bloom)
//   - Entire component is a single <a> tag — opens sourceUrl in new tab

import { useState } from 'react';
import './ArticleCard.css';

// Maps category to its CSS variable reference (still token-driven via var())
const CATEGORY_COLOR = {
  LATEST:    'var(--color-category-latest)',
  RESULTS:   'var(--color-category-results)',
  TRANSFERS: 'var(--color-category-transfers)',
  INJURIES:  'var(--color-category-injuries)',
  RUMOURS:   'var(--color-category-rumours)',
};

function CardImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return <div className="article-card__img-fallback" aria-label={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="article-card__img"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function ArticleCard({ article }) {
  if (!article) return null;

  const { headline, category, source, sourceUrl, timeAgo, imageUrl } = article;
  const categoryColor = CATEGORY_COLOR[category] ?? 'var(--color-category-latest)';

  return (
    <a
      className="article-card"
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read article: ${headline}`}
    >
      {/* ── Image — top corners rounded, bottom corners flush ─── */}
      <div className="article-card__media">
        <CardImage src={imageUrl} alt={headline} />
      </div>

      {/* ── Card body ───────────────────────────────────────────── */}
      <div className="article-card__body">
        {/* Category label: flat colored text only, no chip background */}
        <span
          className="article-card__category"
          style={{ color: categoryColor }}
        >
          {category}
        </span>

        {/* Headline: Inter, 2-line max */}
        <p className="article-card__headline">{headline}</p>

        {/* Footer: source · timeAgo */}
        <div className="article-card__footer">
          <span className="article-card__source">{source}</span>
          <span className="article-card__dot" aria-hidden="true">·</span>
          <span className="article-card__time">{timeAgo}</span>
        </div>
      </div>
    </a>
  );
}
