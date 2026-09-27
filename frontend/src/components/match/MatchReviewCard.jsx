// src/components/match/MatchReviewCard.jsx — featured related article, Overview tab
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { news } from '../../data/mockData';
import './MatchReviewCard.css';

export default function MatchReviewCard({ homeTeamId, awayTeamId }) {
  const navigate = useNavigate();
  const article = useMemo(
    () => news.find((a) => a.teamId === homeTeamId || a.teamId === awayTeamId),
    [homeTeamId, awayTeamId]
  );

  if (!article) return null;

  return (
    <section className="match-detail__card">
      <h2 className="match-detail__card-title">
        <Newspaper size={16} strokeWidth={2} /> Match Review
      </h2>
      <button type="button" className="match-review" onClick={() => navigate('/news')}>
        {article.imageUrl && <img src={article.imageUrl} alt="" className="match-review__img" />}
        <div className="match-review__text">
          <p className="match-review__headline">{article.headline ?? article.title}</p>
          <span className="match-review__meta">{article.source} · {article.timeAgo}</span>
        </div>
      </button>
    </section>
  );
}
