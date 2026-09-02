// src/components/team-profile/TeamNews.jsx
import ArticleCard from '../news/ArticleCard';
import './TeamNews.css';

export default function TeamNews({ articles = [], onSeeMore }) {
  const visibleArticles = articles.slice(0, 4);

  return (
    <div className="team-profile__news-card">
      <div className="team-profile__news-header">
        <span className="team-profile__news-title">TEAM NEWS</span>
        <span className="team-profile__news-sub">{articles.length} Articles</span>
      </div>

      <div className="team-profile__news-grid">
        {visibleArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length > 4 && (
        <button
          type="button"
          className="team-profile__news-see-more"
          onClick={onSeeMore}
        >
          See more
        </button>
      )}
    </div>
  );
}
