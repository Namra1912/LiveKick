// src/pages/Profile.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, Target, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Crest from '../components/shared/Crest';
import { useFollowedTeams } from '../context/FollowedTeamsContext';
import { currentUser, teams } from '../data/mockData';
import { pageIn } from '../lib/motion';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { favTeamIds } = useFollowedTeams();

  const followedTeams = favTeamIds
    .map((id) => teams.find((t) => t.id === id))
    .filter(Boolean);

  const accuracy = currentUser.totalPredictions > 0
    ? Math.round((currentUser.correctPredictions / currentUser.totalPredictions) * 100)
    : 0;

  return (
    <AppLayout>
      <motion.main className="profile-page" initial="hidden" animate="show" variants={pageIn}>
        <div className="profile-page__inner">
          <section className="profile-hero">
            <img
              className="profile-hero__avatar"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=00B370&color=071a11&size=160&bold=true&format=svg`}
              alt={currentUser.name}
            />
            <h1 className="profile-hero__name">{currentUser.name}</h1>
            <span className="profile-hero__email">{currentUser.email}</span>
            <button type="button" className="profile-hero__settings-btn" onClick={() => navigate('/settings')}>
              <SettingsIcon size={14} strokeWidth={2} /> Edit Settings
            </button>
          </section>

          <section className="profile-stats">
            <div className="profile-stat">
              <Coins size={18} strokeWidth={2} />
              <span className="profile-stat__value">{currentUser.matchdayCoins.toLocaleString()}</span>
              <span className="profile-stat__label">Matchday Coins</span>
            </div>
            <div className="profile-stat">
              <Target size={18} strokeWidth={2} />
              <span className="profile-stat__value">{currentUser.totalPredictions}</span>
              <span className="profile-stat__label">Predictions Made</span>
            </div>
            <div className="profile-stat">
              <CheckCircle2 size={18} strokeWidth={2} />
              <span className="profile-stat__value">{accuracy}%</span>
              <span className="profile-stat__label">Accuracy</span>
            </div>
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">Favorite Teams</h2>
            {followedTeams.length === 0 ? (
              <p className="profile-card__empty">
                You&apos;re not following any teams yet — follow one from its team page.
              </p>
            ) : (
              <div className="profile-teams-grid">
                {followedTeams.map((team) => (
                  <button
                    type="button"
                    key={team.id}
                    className="profile-team-tile"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <Crest team={team} size={36} />
                    <span>{team.shortName}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </motion.main>
    </AppLayout>
  );
}
