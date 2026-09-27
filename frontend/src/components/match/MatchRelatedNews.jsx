// src/components/match/MatchRelatedNews.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { news } from '../../data/mockData';
import './MatchRelatedNews.css';

export default function MatchRelatedNews({ homeTeamId, awayTeamId }) {
  const navigate = useNavigate();

  // Skips the first match — that one is already featured as the Overview
  // tab's Match Review card, so the sidebar doesn't repeat it.
  const articles = useMemo(() => {
    return news
      .filter((a) => a.teamId === homeTeamId || a.teamId === awayTeamId)
      .slice(1, 4);
  }, [homeTeamId, awayTeamId]);

  if (articles.length === 0) return null;

  return (
    <div className="match-related-news">
      <h2 className="match-detail__card-title">Related News</h2>
      <div className="match-related-news__list">
        {articles.map((a) => (
          <button
            type="button"
            key={a.id}
            className="match-related-news__item"
            onClick={() => navigate('/news')}
          >
            {a.imageUrl && <img src={a.imageUrl} alt="" className="match-related-news__thumb" />}
            <div className="match-related-news__text">
              <p className="match-related-news__headline">{a.headline ?? a.title}</p>
              <span className="match-related-news__meta">{a.source} · {a.timeAgo}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
