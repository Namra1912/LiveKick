// src/components/panels/NewsList.jsx
// Trending News — photographic thumbnail + headline + time/category

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import './NewsList.css';

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NewsThumbnail({ url, alt }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !url) {
    return <div className="news-item__thumbnail news-item__thumbnail--fallback">NE</div>;
  }

  return (
    <div className="news-item__thumbnail">
      <img
        src={url}
        alt={alt}
        className="news-item__img"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

function NewsItem({ item }) {
  return (
    <div
      className="news-item"
      role="button"
      tabIndex={0}
      aria-label={item.title}
    >
      {/* Photographic thumbnail */}
      <NewsThumbnail url={item.thumbnailUrl} alt={item.title} />

      {/* Text */}
      <div className="news-item__text">
        <p className="news-item__headline">{item.title}</p>
        <div className="news-item__meta">
          <span className="news-item__time">{formatRelativeTime(item.publishedAt)}</span>
          <span className="news-item__dot">·</span>
          <span className="news-item__category">{item.category}</span>
        </div>
      </div>
    </div>
  );
}

export default function NewsList({ newsItems }) {
  if (!newsItems?.length) return null;

  return (
    <section className="news-list">
      {/* Header */}
      <div className="news-list__header">
        <h2 className="news-list__title">Trending News</h2>
        <button className="news-list__view-all">
          View All
          <ExternalLink size={10} strokeWidth={2} />
        </button>
      </div>

      {/* News list */}
      <div className="news-list__items">
        {newsItems.map((item) => (
          <NewsItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
