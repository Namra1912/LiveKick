// src/components/team-profile/TeamNewsTab.jsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './TeamNewsTab.css';

// Category → pill background color (stays on-brand with Night-Pitch tokens)
const CATEGORY_COLOR = {
  LATEST:    '#00B370',
  RESULTS:   '#3b82f6',
  TRANSFERS: '#f59e0b',
  INJURIES:  '#f87171',
  RUMOURS:   '#a78bfa',
};

export default function TeamNewsTab({ articles = [] }) {
  const [visibleBlocks, setVisibleBlocks] = useState(1);
  const [enteringBlocks, setEnteringBlocks] = useState({});

  if (!articles || articles.length === 0) return null;

  // Sort newest → oldest by publishedAt, falling back to array order
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt ?? 0) - new Date(a.publishedAt ?? 0)
  );

  // Pagination: block 0 = 5 articles, each subsequent block = 6 articles
  const totalVisible = 5 + (visibleBlocks - 1) * 6;
  const visibleArticles = sorted.slice(0, totalVisible);
  const hasMore = visibleArticles.length < sorted.length;

  const handleShowMore = () => {
    const nextIdx = visibleBlocks; // 0-based index of the block being added
    setEnteringBlocks((prev) => ({ ...prev, [nextIdx]: true }));
    setVisibleBlocks((prev) => prev + 1);
    setTimeout(() => {
      setEnteringBlocks((prev) => {
        const copy = { ...prev };
        delete copy[nextIdx];
        return copy;
      });
    }, 350);
  };

  // Slice visible articles into blocks
  const blocks = [];
  if (visibleArticles.length > 0) {
    blocks.push(visibleArticles.slice(0, 5));
  }
  for (let k = 1; k < visibleBlocks; k++) {
    const start = 5 + (k - 1) * 6;
    const slice = visibleArticles.slice(start, start + 6);
    if (slice.length > 0) blocks.push(slice);
  }

  const openArticle = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="team-news-tab">
      {blocks.map((blockArticles, blockIdx) => {
        const isEntering = !!enteringBlocks[blockIdx];

        /* ── BLOCK TYPE A ─── First block: hero image + 4-item list ── */
        if (blockIdx === 0) {
          const hero = blockArticles[0];
          const listItems = blockArticles.slice(1);
          const heroCategoryColor =
            CATEGORY_COLOR[hero?.category] ?? CATEGORY_COLOR.LATEST;

          return (
            <div
              key="block-0"
              className={`news-block news-block--type-a${isEntering ? ' news-block--entering' : ''}`}
            >
              {/* ── Left: Hero Article ────────────────────────────────── */}
              {hero && (
                <div
                  className="news-hero"
                  onClick={() => openArticle(hero.sourceUrl ?? hero.url)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Read: ${hero.headline ?? hero.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openArticle(hero.sourceUrl ?? hero.url);
                    }
                  }}
                >
                  {/* Background image — child div for scale-on-hover isolation */}
                  <div
                    className="news-hero__bg"
                    style={{ backgroundImage: `url(${hero.imageUrl})` }}
                  />
                  {/* Dark gradient overlay */}
                  <div className="news-hero__overlay" />
                  {/* Category pill — top-left */}
                  <span
                    className="news-hero__pill"
                    style={{ background: heroCategoryColor }}
                  >
                    {hero.category}
                  </span>
                  {/* Text content — absolute bottom */}
                  <div className="news-hero__content">
                    <h2 className="news-hero__headline">
                      {hero.headline ?? hero.title}
                    </h2>
                    <div className="news-hero__meta">
                      <span>{hero.source}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{hero.timeAgo}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Right: Articles 1–4 List ─────────────────────────── */}
              <div className="news-list">
                {listItems.map((art) => (
                  <div
                    key={art.id}
                    className="news-list-item"
                    onClick={() => openArticle(art.sourceUrl ?? art.url)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Read: ${art.headline ?? art.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openArticle(art.sourceUrl ?? art.url);
                      }
                    }}
                  >
                    <div className="news-list-item__text">
                      <h3 className="news-list-headline">
                        {art.headline ?? art.title}
                      </h3>
                      <div className="news-list-item__meta">
                        <span>{art.source}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{art.timeAgo}</span>
                      </div>
                    </div>
                    {art.imageUrl && (
                      <img
                        src={art.imageUrl}
                        alt=""
                        className="news-list-item__img"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        /* ── BLOCK TYPE B ─── Subsequent blocks: 2-column grid ──────── */
        const cellCount = blockArticles.length;
        // Cells in the last row should have no bottom border
        const lastRowStart = cellCount % 2 === 0 ? cellCount - 2 : cellCount - 1;

        return (
          <div
            key={`block-${blockIdx}`}
            className={`news-block news-block--type-b${isEntering ? ' news-block--entering' : ''}`}
          >
            <div className="news-grid">
              {blockArticles.map((art, cellIdx) => {
                const isLeft = cellIdx % 2 === 0;
                const isLastRow = cellIdx >= lastRowStart;

                return (
                  <div
                    key={art.id}
                    className={[
                      'news-grid-cell',
                      isLeft ? 'news-grid-cell--left' : 'news-grid-cell--right',
                      isLastRow ? 'news-grid-cell--no-bottom' : '',
                    ].join(' ').trim()}
                    onClick={() => openArticle(art.sourceUrl ?? art.url)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Read: ${art.headline ?? art.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openArticle(art.sourceUrl ?? art.url);
                      }
                    }}
                  >
                    <div className="news-grid-cell__text">
                      <h3 className="news-grid-cell__headline">
                        {art.headline ?? art.title}
                      </h3>
                      <div className="news-grid-cell__meta">
                        <span>{art.source}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{art.timeAgo}</span>
                      </div>
                    </div>
                    {art.imageUrl && (
                      <img
                        src={art.imageUrl}
                        alt=""
                        className="news-grid-cell__img"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── Show More Button ─────────────────────────────────────────── */}
      {hasMore && (
        <button
          type="button"
          className="news-show-more"
          onClick={handleShowMore}
        >
          Show more
          <ChevronDown size={15} strokeWidth={2.2} style={{ marginLeft: 6, flexShrink: 0 }} />
        </button>
      )}
    </div>
  );
}
