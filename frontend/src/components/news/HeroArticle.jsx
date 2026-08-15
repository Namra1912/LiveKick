// src/components/news/HeroArticle.jsx
// Full-width featured article card for the News page.
//
// Props:
//   article {object} — a single news entry from mockData.js
//   Fields used: headline, category, source, sourceUrl, author,
//                readTime, timeAgo, imageUrl
//
// Design:
//   - Double-bezel card treatment (border + --shadow-inset + --shadow-card)
//   - 16:9 image with dark gradient overlay on the bottom portion
//   - Category label: flat colored text via --color-category-* tokens
//   - Headline: Big Shoulders Display, uppercase, 3-line clamp
//   - Footer row: Inter, --color-secondary
//   - Read-time number: JetBrains Mono
//   - Source badge: pill in top-right corner of image
//   - Entire component is a single <a> tag — opens sourceUrl in new tab

import { useState } from 'react';
import './HeroArticle.css';

// Maps category string to its CSS custom property reference.
// Using var() strings as inline style values is valid — still token-driven,
// no hardcoded hex values anywhere.
const CATEGORY_COLOR = {
  LATEST:    'var(--color-category-latest)',
  RESULTS:   'var(--color-category-results)',
  TRANSFERS: 'var(--color-category-transfers)',
  INJURIES:  'var(--color-category-injuries)',
  RUMOURS:   'var(--color-category-rumours)',
};

function HeroImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return <div className="hero-article__img-fallback" aria-label={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="hero-article__img"
      onError={() => setFailed(true)}
    />
  );
}

export default function HeroArticle({ article }) {
  if (!article) return null;

  const {
    headline,
    category,
    source,
    sourceUrl,
    author,
    readTime,
    timeAgo,
    imageUrl,
  } = article;

  const categoryColor = CATEGORY_COLOR[category] ?? 'var(--color-category-latest)';

  return (
    <a
      className="hero-article"
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read article: ${headline}`}
    >
      {/* ── Image + overlay ─────────────────────────────────────── */}
      <div className="hero-article__media">
        <HeroImage src={imageUrl} alt={headline} />

        {/* Dark gradient — bottom 60% of image, bleeds to base color */}
        <div className="hero-article__overlay" aria-hidden="true" />

        {/* Source badge — top-right */}
        <span className="hero-article__source-badge">{source}</span>

        {/* Bottom-aligned editorial content */}
        <div className="hero-article__content">
          {/* Category label: flat colored text, no chip background */}
          <span
            className="hero-article__category"
            style={{ color: categoryColor }}
          >
            {category}
          </span>

          {/* Headline: Big Shoulders Display, uppercase */}
          <h2 className="hero-article__headline">{headline}</h2>

          {/* Meta row: author · readTime min read · timeAgo */}
          <div className="hero-article__meta">
            {author && (
              <>
                <span className="hero-article__author">By {author}</span>
                <span className="hero-article__dot" aria-hidden="true">·</span>
              </>
            )}
            <span>
              <span className="hero-article__readtime">{readTime}</span>
              {' '}min read
            </span>
            <span className="hero-article__dot" aria-hidden="true">·</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
